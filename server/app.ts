import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { hash } from "bcrypt";
import path from "path";

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware for logging
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
        logLine += ` - ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Register API routes
registerRoutes(app);

// Handle static files and client-side routing for production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the dist/public directory
  app.use(express.static(path.join(process.cwd(), "dist", "public")));
  
  // For any other request, send the index.html file (client-side routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "public", "index.html"));
  });
} else {
  // In development, use Vite's dev server
  setupVite(app);
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// For Vercel serverless environment
export { app };

// For direct running from Node.js
if (process.env.NODE_ENV !== "test") {
  // Create admin user on startup
  async function ensureAdminExists() {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      
      if (!existingAdmin) {
        console.log("Creating admin user...");
        const hashedPassword = await hash("admin123", 10);
        
        const adminUser = await storage.createUser({
          username: "admin",
          password: hashedPassword,
          email: "admin@globalservices.com",
          role: "admin"
        });
        
        console.log("Admin user created successfully!");
        console.log("Username: admin");
        console.log("Password: admin123");
      } else {
        console.log("Admin user already exists");
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  }

  // Only run this when directly executed, not when imported by Vercel
  if (process.env.VERCEL !== "1") {
    ensureAdminExists();
  }
}
