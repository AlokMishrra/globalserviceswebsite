import express, { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { z } from "zod";
import { hash, compare } from "bcrypt";
import { insertUserSchema } from "@shared/schema";

const router = express.Router();

// User registration endpoint
router.post("/register", async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const validatedData = insertUserSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(validatedData.username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await hash(validatedData.password, 10);

    // Create the user with hashed password
    const user = await storage.createUser({
      ...validatedData,
      password: hashedPassword,
    });

    // Don't send the password in the response
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User login endpoint
router.post("/login", async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { username, password } = z.object({
      username: z.string(),
      password: z.string(),
    }).parse(req.body);

    // Find the user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the password
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Set the user in the session
    if (req.session) {
      req.session.userId = user.id;
      req.session.userRole = user.role;
    }

    // Don't send the password in the response
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to login" });
  }
});

// Get current user endpoint
router.get("/me", async (req: Request, res: Response) => {
  try {
    // Check if the user is authenticated
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Find the user
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't send the password in the response
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

// Logout endpoint
router.post("/logout", (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    res.status(200).json({ message: "Not logged in" });
  }
});

// Middleware to check if user is authenticated
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: "Not authenticated" });
};

// Middleware to check if user is an admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.userId && req.session.userRole === "admin") {
    return next();
  }
  res.status(403).json({ error: "Not authorized" });
};

export default router;