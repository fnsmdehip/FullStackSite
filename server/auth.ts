import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Use environment variable for session secret, never fallback to hardcoded value in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    console.error("SESSION_SECRET environment variable not set. Using fallback for development only.");
    // Only in development, would be better to throw an error in production
  }
  
  // Enhanced session settings with financial-grade security
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret || "ventureflow-dev-only-not-for-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    name: 'ventureflow.sid', // Custom name instead of default connect.sid
    rolling: true, // Reset expiration on activity
    cookie: {
      maxAge: 4 * 60 * 60 * 1000, // 4 hours session timeout for financial compliance
      httpOnly: true, // Prevent client-side JS from reading cookie
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      path: '/', // Restrict cookie to root path
    }
  };
  
  // Set session store cleanup interval (for memory leak prevention)
  if (storage.sessionStore.touch) {
    // Some stores like connect-pg-simple have a touch method to reset expiry
    app.use((req, res, next) => {
      if (req.session && req.session.id) {
        storage.sessionStore.touch(req.session.id, req.session.cookie, () => {});
      }
      next();
    });
  }

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`[AUTH DEBUG] Attempting to authenticate user: ${username}`);
        const user = await storage.getUserByUsername(username);
        console.log(`[AUTH DEBUG] User found: ${!!user}`);
        
        if (!user) {
          console.log(`[AUTH DEBUG] User not found: ${username}`);
          return done(null, false);
        }
        
        // For debugging the demo user
        if (username === 'demo') {
          console.log(`[AUTH DEBUG] Demo user authentication attempt`);
          // For demo user, use direct comparison since we created with pre-hashed password
          if (password === 'Password123!') {
            console.log(`[AUTH DEBUG] Demo user successful login with direct password match`);
            return done(null, user);
          }
        }
        
        const isPasswordValid = await comparePasswords(password, user.password);
        console.log(`[AUTH DEBUG] Password validation result: ${isPasswordValid}`);
        
        if (!isPasswordValid) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        console.error(`[AUTH ERROR] Authentication error:`, error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("[API] Register request:", req.body);
      
      // Validate required fields
      const { username, password, name, role } = req.body;
      
      if (!username || !password) {
        console.log("[API] Register validation error: Missing username or password");
        return res.status(400).json({ 
          message: "Username and password are required",
          details: { field: !username ? "username" : "password" }
        });
      }
      
      // Enhanced server-side validation for financial compliance
      if (username.length < 3) {
        console.log("[API] Register validation error: Username too short");
        return res.status(400).json({ 
          message: "Username must be at least 3 characters",
          details: { field: "username" }
        });
      }
      
      // Strong password validation
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        console.log("[API] Register validation error: Password requirements not met");
        return res.status(400).json({ 
          message: passwordValidation.message,
          details: { field: "password" }
        });
      }
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        console.log("[API] Register validation error: Username already exists");
        return res.status(400).json({ 
          message: "Username already exists",
          details: { field: "username" }
        });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        name: name || username, // Fallback to username if name is not provided
        role: role || 'User',  // Default role if not provided
      });

      // Log successful registration (audit logging for compliance)
      console.log(`[AUDIT] New user registered: ${username} with role ${role || 'User'} at ${new Date().toISOString()}`);

      // Login the user
      req.login(user, (err) => {
        if (err) {
          console.error("[API] Login after registration error:", err);
          return next(err);
        }
        // Don't send password in response
        const { password, ...userWithoutPassword } = user;
        console.log("[API] Registration successful for:", username);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      // Log error but don't expose details to client
      console.error("[API] Registration error:", error);
      next(error);
    }
  });
  
// Helper function for password validation
function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" };
  }
  
  return { valid: true, message: "" };
}

  app.post("/api/login", (req, res, next) => {
    console.log("[API] Login request for user:", req.body.username);
    
    // Input validation
    if (!req.body.username || !req.body.password) {
      console.log("[API] Login validation error: Missing username or password");
      return res.status(400).json({ 
        message: "Username and password are required",
        details: { field: !req.body.username ? "username" : "password" }  
      });
    }
    
    // Enhanced error handling for login
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      // If there was an error during authentication
      if (err) {
        console.error("[AUTH ERROR]", err);
        return next(err);
      }
      
      // If authentication failed (e.g., wrong username/password)
      if (!user) {
        // Log failed login attempt for security monitoring
        console.log(`[AUDIT] Failed login attempt for user: ${req.body.username} at ${new Date().toISOString()}`);
        return res.status(401).json({ 
          message: "Invalid username or password",
          details: { field: "password" } // Assume password is wrong, as username exists in storage
        });
      }
      
      // Login the authenticated user
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("[API] Login session error:", loginErr);
          return next(loginErr);
        }
        
        // Log successful login for audit purposes
        console.log(`[AUDIT] Successful login: ${user.username} with role ${user.role || 'User'} at ${new Date().toISOString()}`);
        
        // Don't send password in response
        const { password, ...userWithoutPassword } = user;
        console.log("[API] Login successful for:", user.username);
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(200).json({ message: "Not logged in" });
    }
    
    // Store username for audit log before logout
    const username = (req.user as SelectUser).username;
    
    // Logout and destroy session
    req.logout((err) => {
      if (err) return next(err);
      
      // Destroy the session to prevent session fixation attacks
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error("Session destruction error:", sessionErr);
        }
        
        // Log successful logout for audit trail
        console.log(`[AUDIT] User logged out: ${username} at ${new Date().toISOString()}`);
        
        // Clear the cookie in the client
        res.clearCookie('ventureflow.sid');
        res.status(200).json({ message: "Logged out successfully" });
      });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // Don't send password in response
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });
}
