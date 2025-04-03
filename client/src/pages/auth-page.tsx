import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
});

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const [demoMode, setDemoMode] = useState(true); // Default to demo mode
  
  // Use try-catch to handle any auth errors
  let user = null;
  let loginMutation: any = { isPending: false, mutateAsync: async () => {} };
  let registerMutation: any = { isPending: false, mutateAsync: async () => {} };
  
  try {
    const auth = useAuth();
    user = auth?.user;
    loginMutation = auth?.loginMutation;
    registerMutation = auth?.registerMutation;
  } catch (error) {
    console.error("Auth context error:", error);
  }

  // Initialize forms with either empty values or demo credentials
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "demo", // Pre-fill with demo username
      password: "Password123!", // Pre-fill with demo password
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      role: "Analyst", // Default role
    },
  });

  // Login form submission
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log("[DEBUG] Login form submit started with values:", values);
    loginForm.clearErrors();
    
    try {
      // Make direct API call instead of using mutation to test
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include" // Important for cookies
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        throw new Error(errorData.message || "Login failed");
      }
      
      const data = await response.json();
      console.log("[DEBUG] Direct API Login response:", data);
      
      // Force navigation to dashboard after successful login
      navigate("/dashboard");
    } catch (error: any) {
      console.error("[DEBUG] Login error details:", error);
      
      loginForm.setError("username", {
        type: "server",
        message: error?.message || "Login failed. Please try again."
      });
    }
  };

  // Registration form submission
  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    console.log("[DEBUG] Registration form submit started with values:", values);
    registerForm.clearErrors();
    
    try {
      // Make direct API call instead of using mutation to test
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include" // Important for cookies
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(errorData.message || "Registration failed");
      }
      
      const data = await response.json();
      console.log("[DEBUG] Direct API Registration response:", data);
      
      // Force navigation to dashboard after successful registration
      navigate("/dashboard");
    } catch (error: any) {
      console.error("[DEBUG] Registration error details:", error);
      
      registerForm.setError("username", {
        type: "server",
        message: error?.message || "Registration failed. Please try again."
      });
    }
  };

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Function to fill demo credentials
  const useDemoCredentials = () => {
    setDemoMode(true);
    loginForm.setValue("username", "demo");
    loginForm.setValue("password", "Password123!");
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
                <path fill="white" d="M8 11h8v2H8z"></path>
                <path fill="white" d="M12 7v10"></path>
              </svg>
              <span className="ml-2 text-2xl font-bold">VentureFlow</span>
            </div>
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Log in or create an account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full relative overflow-hidden"
                      disabled={loginMutation?.isPending}
                    >
                      {loginMutation?.isPending ? (
                        <>
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging in...
                          </span>
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                    
                    <div className="text-center space-y-4 pt-2">
                      <p className="text-xs text-muted-foreground">
                        For testing, you can use our one-click login:
                      </p>
                      <Button 
                        variant="secondary" 
                        className="w-full" 
                        type="button"
                        onClick={async () => {
                          try {
                            console.log("[DEBUG] One-click demo login clicked");
                            
                            // Make direct API call instead of using mutation to test
                            const response = await fetch("/api/login", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({username: "demo", password: "Password123!"}),
                              credentials: "include" // Important for cookies
                            });
                            
                            if (!response.ok) {
                              const errorData = await response.json().catch(() => ({ message: "Login failed" }));
                              throw new Error(errorData.message || "Login failed");
                            }
                            
                            const data = await response.json();
                            console.log("[DEBUG] Direct API Demo Login response:", data);
                            
                            // First manually update form values to match demo credentials
                            loginForm.setValue("username", "demo");
                            loginForm.setValue("password", "Password123!");
                            
                            // Force immediate navigation to dashboard
                            window.location.href = "/dashboard";
                          } catch (error) {
                            console.error("[DEBUG] Demo login error details:", error);
                          }
                        }}
                      >
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z"></path>
                          <path d="M12 16v-4"></path>
                          <path d="M12 8h.01"></path>
                        </svg>
                        One-Click Demo Login
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="Analyst">Analyst</option>
                              <option value="Associate">Associate</option>
                              <option value="Principal">Principal</option>
                              <option value="Partner">Partner</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full relative overflow-hidden"
                      disabled={registerMutation?.isPending}
                    >
                      {registerMutation?.isPending ? (
                        <>
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                          </span>
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Right Side - Hero Banner */}
      <div className="flex-1 bg-gradient-to-br from-primary-600 to-primary-800 hidden sm:flex flex-col justify-center p-8 text-white">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Enterprise VC/PE Platform for Modern Investors
          </h1>
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Intelligent deal sourcing and pipeline management</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Advanced financial modeling and analytics</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Real-time portfolio monitoring and KPI tracking</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>AI-powered market intelligence and insights</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Web3 & Blockchain Investment Tools</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}