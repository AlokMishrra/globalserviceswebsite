import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
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

  const httpServer = createServer(app);

  return httpServer;
}
