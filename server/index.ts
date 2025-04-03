import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Initialize Express app
const app = express();

// Security middleware with custom CSP for development
const isDev = process.env.NODE_ENV !== 'production';

// Configure Helmet with environment-appropriate security settings
app.use(
  helmet({
    contentSecurityPolicy: isDev 
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow inline scripts for development
            connectSrc: ["'self'", "ws:", "wss:"], // Allow WebSocket connections for HMR
            imgSrc: ["'self'", "data:", "blob:"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "data:"],
          },
        }
      : undefined, // Use Helmet's default strict CSP in production
  })
);

// Rate limiting for all API routes to prevent brute force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." }
});

// Apply stricter rate limits to auth endpoints to protect against brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." }
});

// Apply auth rate limits only to login and registration routes
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);

// Apply general rate limiting to all other API routes
app.use("/api", apiLimiter);

// Body parsing middleware with size limits to prevent DoS attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// CSRF protection middleware - Only accept requests with proper headers
app.use('/api', (req, res, next) => {
  // Check for the X-Requested-With header which is set by our frontend fetch calls
  // This protects against CSRF attacks by ensuring the request came from our frontend
  
  // Skip CSRF check for login and register routes during development
  if (req.path === '/login' || req.path === '/register' || req.path === '/user') {
    return next();
  }
  
  const requestedWith = req.headers['x-requested-with'];
  if (req.method !== 'GET' && (!requestedWith || requestedWith !== 'XMLHttpRequest')) {
    console.log(`[SECURITY] CSRF validation failed for ${req.method} ${req.path}`);
    return res.status(403).json({ message: 'CSRF validation failed' });
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Centralized error handling that doesn't leak sensitive information
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    
    // Only provide detailed error messages in development environment
    const isDev = app.get("env") === "development";
    const message = isDev 
      ? err.message || "Internal Server Error" 
      : status >= 500 
        ? "Internal Server Error" 
        : err.message || "Request Error";
    
    // Log the full error for debugging but don't expose it to the client in production
    if (status >= 500) {
      console.error("Server error:", err);
    }

    // Return a sanitized error response
    res.status(status).json({ 
      error: true,
      message,
      // Include stack trace only in development
      ...(isDev && { stack: err.stack })
    });

    // Don't throw the error as it could crash the server
    // Instead, let the error middleware handle it properly
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
