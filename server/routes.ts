import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertServiceSchema, 
  insertPortfolioItemSchema, 
  insertBlogPostSchema, 
  insertJobOpeningSchema,
  insertUserSchema,
  insertTeamMemberSchema,
  insertCompanyInfoSchema
} from "@shared/schema";
import { z } from "zod";
import authRouter, { isAdmin, isAuthenticated } from "./auth";
import uploadRouter from "./api/upload";
import teamRouter from "./api/team";
import companyInfoRouter from "./api/company-info";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      name: "global-services-session",
      cookie: { maxAge: 86400000, secure: false }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // 24 hours
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "global-services-secret-key"
    })
  );

  // Auth routes
  app.use("/api/auth", authRouter);
  
  // File upload routes
  app.use("/api/admin/upload", uploadRouter);
  
  // Serve uploaded files
  const uploadsDir = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  // PUBLIC API ROUTES
  
  // Get all services
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  // Get a specific service by slug
  app.get('/api/services/:slug', async (req, res) => {
    try {
      const service = await storage.getServiceBySlug(req.params.slug);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch service' });
    }
  });

  // Get all portfolio items
  app.get('/api/portfolio', async (req, res) => {
    try {
      const portfolioItems = await storage.getAllPortfolioItems();
      res.json(portfolioItems);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch portfolio items' });
    }
  });

  // Get a specific portfolio item by slug
  app.get('/api/portfolio/:slug', async (req, res) => {
    try {
      const portfolioItem = await storage.getPortfolioItemBySlug(req.params.slug);
      if (!portfolioItem) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      res.json(portfolioItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch portfolio item' });
    }
  });

  // Get all blog posts
  app.get('/api/blog', async (req, res) => {
    try {
      const blogPosts = await storage.getAllBlogPosts();
      res.json(blogPosts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  // Get a specific blog post by slug
  app.get('/api/blog/:slug', async (req, res) => {
    try {
      const blogPost = await storage.getBlogPostBySlug(req.params.slug);
      if (!blogPost) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(blogPost);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  // Submit contact form
  app.post('/api/contact', async (req, res) => {
    try {
      const contactData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(contactData);
      res.status(201).json({ message: 'Contact form submitted successfully', id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to submit contact form' });
    }
  });

  // Get all job openings
  app.get('/api/jobs', async (req, res) => {
    try {
      const jobOpenings = await storage.getAllJobOpenings();
      res.json(jobOpenings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch job openings' });
    }
  });

  // Get a specific job opening by slug
  app.get('/api/jobs/:slug', async (req, res) => {
    try {
      const jobOpening = await storage.getJobOpeningBySlug(req.params.slug);
      if (!jobOpening) {
        return res.status(404).json({ message: 'Job opening not found' });
      }
      res.json(jobOpening);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch job opening' });
    }
  });

  // ADMIN API ROUTES - Protected by isAdmin middleware
  
  // Services management
  app.post('/api/admin/services', isAdmin, async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create service' });
    }
  });

  app.put('/api/admin/services/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, serviceData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update service' });
    }
  });

  app.delete('/api/admin/services/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteService(id);
      if (!success) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete service' });
    }
  });

  // Portfolio items management
  app.post('/api/admin/portfolio', isAdmin, async (req, res) => {
    try {
      const portfolioData = insertPortfolioItemSchema.parse(req.body);
      const portfolioItem = await storage.createPortfolioItem(portfolioData);
      res.status(201).json(portfolioItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create portfolio item' });
    }
  });

  app.put('/api/admin/portfolio/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const portfolioData = insertPortfolioItemSchema.partial().parse(req.body);
      const portfolioItem = await storage.updatePortfolioItem(id, portfolioData);
      res.json(portfolioItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update portfolio item' });
    }
  });

  app.delete('/api/admin/portfolio/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePortfolioItem(id);
      if (!success) {
        return res.status(404).json({ message: 'Portfolio item not found' });
      }
      res.json({ message: 'Portfolio item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete portfolio item' });
    }
  });

  // Blog posts management
  app.post('/api/admin/blog', isAdmin, async (req, res) => {
    try {
      const blogData = insertBlogPostSchema.parse(req.body);
      const blogPost = await storage.createBlogPost(blogData);
      res.status(201).json(blogPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  });

  app.put('/api/admin/blog/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const blogData = insertBlogPostSchema.partial().parse(req.body);
      const blogPost = await storage.updateBlogPost(id, blogData);
      res.json(blogPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update blog post' });
    }
  });

  app.delete('/api/admin/blog/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete blog post' });
    }
  });

  // Contact submissions - Admin can view all and delete
  app.get('/api/admin/contact', isAdmin, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch contact submissions' });
    }
  });

  app.delete('/api/admin/contact/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContactSubmission(id);
      if (!success) {
        return res.status(404).json({ message: 'Contact submission not found' });
      }
      res.json({ message: 'Contact submission deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete contact submission' });
    }
  });

  // Job openings management
  app.post('/api/admin/jobs', isAdmin, async (req, res) => {
    try {
      const jobData = insertJobOpeningSchema.parse(req.body);
      const jobOpening = await storage.createJobOpening(jobData);
      res.status(201).json(jobOpening);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create job opening' });
    }
  });

  app.put('/api/admin/jobs/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const jobData = insertJobOpeningSchema.partial().parse(req.body);
      const jobOpening = await storage.updateJobOpening(id, jobData);
      res.json(jobOpening);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update job opening' });
    }
  });

  app.delete('/api/admin/jobs/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteJobOpening(id);
      if (!success) {
        return res.status(404).json({ message: 'Job opening not found' });
      }
      res.json({ message: 'Job opening deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete job opening' });
    }
  });

  // User management - Admin only
  // Get all users
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Don't send passwords to the client
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Create user
  app.post('/api/admin/users', isAdmin, async (req, res) => {
    try {
      // Add validation
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash the password with bcrypt before storing
      const { hash } = await import('bcrypt');
      const hashedPassword = await hash(userData.password, 10);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Don't send the password in the response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });
  
  // Update user
  app.patch('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Check if user exists
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Allow partial updates and validate
      const userData = insertUserSchema.partial().parse(req.body);
      
      // If updating username, check if it's already taken
      if (userData.username && userData.username !== existingUser.username) {
        const userWithSameUsername = await storage.getUserByUsername(userData.username);
        if (userWithSameUsername) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }
      
      // Hash password if it's being updated
      if (userData.password) {
        const { hash } = await import('bcrypt');
        userData.password = await hash(userData.password, 10);
      }
      
      // Update user
      const updatedUser = await storage.updateUser(id, userData);
      
      // Don't send the password in the response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update user' });
    }
  });
  
  // Delete user
  app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Prevent deleting your own account
      if (req.session?.userId === id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }
      
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });

  // Website Settings Management
  
  // Get website settings
  app.get('/api/admin/settings', isAdmin, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch settings' });
    }
  });
  
  // Update website settings
  app.post('/api/admin/settings', isAdmin, async (req, res) => {
    try {
      const settings = req.body;
      
      // Validate general section
      if (settings.general && !settings.general.siteName) {
        return res.status(400).json({ message: 'Site name is required' });
      }
      
      // Validate contact section
      if (settings.contact) {
        if (settings.contact.email && !settings.contact.email.includes('@')) {
          return res.status(400).json({ message: 'Invalid email address' });
        }
        if (settings.contact.contactFormEmail && !settings.contact.contactFormEmail.includes('@')) {
          return res.status(400).json({ message: 'Invalid contact form email address' });
        }
      }
      
      const updatedSettings = await storage.updateSettings(settings);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update settings' });
    }
  });

  // Team Members public API
  app.use('/api/team', teamRouter);

  // Team Members admin API - routes already protected by isAdmin middleware
  app.use('/api/admin/team', teamRouter);

  // Company Info public API
  app.use('/api/company-info', companyInfoRouter);

  // Company Info admin API - routes already protected by isAdmin middleware
  app.use('/api/admin/company-info', companyInfoRouter);

  const httpServer = createServer(app);

  return httpServer;
}
