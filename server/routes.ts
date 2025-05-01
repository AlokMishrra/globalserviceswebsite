import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSubmissionSchema, 
  insertServiceSchema, 
  insertPortfolioItemSchema, 
  insertBlogPostSchema, 
  insertJobOpeningSchema
} from "@shared/schema";
import { z } from "zod";
import authRouter, { isAdmin, isAuthenticated } from "./auth";
import session from "express-session";
import MemoryStore from "memorystore";

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

  const httpServer = createServer(app);

  return httpServer;
}
