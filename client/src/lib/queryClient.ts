import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Custom error class with additional properties
class ApiError extends Error {
  status: number;
  errorId?: string;
  details?: any;
  
  constructor(message: string, status: number, errorId?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorId = errorId;
    this.details = details;
  }
}

// Central error handling function
function handleApiError(error: any, context?: string) {
  // Log errors to console in development only
  if (process.env.NODE_ENV !== 'production') {
    console.error(`API Error${context ? ` during ${context}` : ''}:`, error);
  }
  
  // If it's an unauthorized error, we'll handle it with redirects in the auth context
  if (error?.status === 401) {
    return error;
  }

  // Return the error to be handled by the caller
  return error;
}

// Enhanced error parsing and handling
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage: string;
    let errorId: string | undefined;
    let errorDetails: any | undefined;
    let errorData: any = null;
    
    // Make a clone of the response for text reading (in case JSON parsing fails)
    const clonedRes = res.clone();
    
    try {
      // Try to parse as JSON error response
      errorData = await res.json();
      errorMessage = errorData.message || res.statusText || 'Unknown error';
      errorId = errorData.errorId;
      errorDetails = errorData.details;
      
      console.log("API Error Response:", { errorMessage, errorData });
    } catch (e) {
      // Fallback to text or status
      try {
        errorMessage = await clonedRes.text() || res.statusText || 'Unknown error';
        console.log("API Error Text:", errorMessage);
      } catch (e) {
        errorMessage = res.statusText || `Error ${res.status}`;
        console.log("API Error Status:", errorMessage);
      }
    }
    
    // Create and throw a structured error
    const apiError = new ApiError(
      errorMessage, 
      res.status, 
      errorId, 
      errorDetails
    );
    
    // Add the full error response data for debugging
    if (errorData) {
      apiError.details = errorData;
    }
    
    console.error("Throwing API Error:", apiError);
    throw apiError;
  }
}

// Enhanced API request function with better error handling and security
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    console.log(`Making ${method} request to ${url}`, data);
    
    // Create headers with CSRF protection - except for auth routes that are exempt on server
    const isAuthRoute = url === '/api/login' || url === '/api/register' || url === '/api/user';
    const headers: HeadersInit = {
      ...(data ? { "Content-Type": "application/json" } : {})
    };
    
    // Authentication routes have CSRF disabled on server
    if (!isAuthRoute) {
      headers["X-Requested-With"] = "XMLHttpRequest"; // CSRF protection
    }

    // Make the request
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Include cookies for session authentication
    });

    console.log(`${method} response status:`, res.status);
    
    // Handle errors - don't throw automatically for 401 on auth routes
    if (res.status !== 401 || !isAuthRoute) {
      await throwIfResNotOk(res);
    }
    
    return res;
  } catch (error) {
    // Process error through central handler
    console.error(`API Request Error (${method} ${url}):`, error);
    handleApiError(error, `${method} ${url}`);
    throw error; // Re-throw for caller handling
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

// Enhanced query function creator
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      // Extract URL from query key
      const url = queryKey[0] as string;
      
      // Check if this is an auth route
      const isAuthRoute = url === '/api/login' || url === '/api/register' || url === '/api/user';
      
      // Prepare headers - only use CSRF for non-auth routes to match server exemptions
      const headers: HeadersInit = {};
      if (!isAuthRoute) {
        headers["X-Requested-With"] = "XMLHttpRequest"; // CSRF protection
      }
      
      // Make request with appropriate headers
      const res = await fetch(url, {
        credentials: "include",
        headers
      });

      // Handle unauthorized responses
      if (res.status === 401) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        } else {
          // For auth pages, we need to throw so we can redirect
          throw new ApiError("Authentication required", 401);
        }
      }

      // Handle other errors
      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Handle and log error
      handleApiError(error, `GET ${queryKey[0]}`);
      throw error; // Re-throw for proper error handling in components
    }
  };

// Enhanced QueryClient configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      // Adding a reasonable staleTime for better performance without compromising data integrity
      staleTime: 5 * 60 * 1000, // 5 minutes
      // We don't retry auth failures or bad requests
      retry: (failureCount, error: any) => {
        // Don't retry 401, 403, 400 errors
        if (error?.status === 401 || error?.status === 403 || error?.status === 400) {
          return false;
        }
        // Only retry server errors twice
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
