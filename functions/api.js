const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session');
const { drizzle } = require('drizzle-orm/pg-core');

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Set up session
const sessionConfig = {
  name: "global-services-session",
  secret: process.env.SESSION_SECRET || 'global-services-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

// In production, set secure cookie
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trust first proxy
}

app.use(session(sessionConfig));

// Auth middleware 
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
};

// Database connection
let db;
let storage;

if (process.env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  
  // Import schema and storage in production
  const initDb = async () => {
    try {
      const schema = require('../shared/schema');
      db = drizzle(pool, { schema });
      
      // Import storage implementation
      const { DatabaseStorage } = require('../server/database-storage');
      storage = new DatabaseStorage(db);
      
      // Create admin user if it doesn't exist
      try {
        const { createAdminUser } = require('./create-admin');
        await createAdminUser();
      } catch (adminError) {
        console.error('Error creating admin user:', adminError);
      }
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  };
  
  initDb();
}

// API endpoints - Public endpoints
app.get('/api/settings', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const settings = await storage.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const services = await storage.getAllServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/services/:slug', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const service = await storage.getServiceBySlug(req.params.slug);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

app.get('/api/portfolio', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const portfolioItems = await storage.getAllPortfolioItems();
    res.json(portfolioItems);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio items' });
  }
});

app.get('/api/portfolio/:slug', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const portfolioItem = await storage.getPortfolioItemBySlug(req.params.slug);
    if (!portfolioItem) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    res.json(portfolioItem);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio item' });
  }
});

app.get('/api/blog', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const blogPosts = await storage.getAllBlogPosts();
    res.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const blogPost = await storage.getBlogPostBySlug(req.params.slug);
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

app.get('/api/team', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const teamMembers = await storage.getAllTeamMembers();
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const jobOpenings = await storage.getAllJobOpenings();
    res.json(jobOpenings);
  } catch (error) {
    console.error('Error fetching job openings:', error);
    res.status(500).json({ error: 'Failed to fetch job openings' });
  }
});

app.get('/api/jobs/:slug', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const jobOpening = await storage.getJobOpeningBySlug(req.params.slug);
    if (!jobOpening) {
      return res.status(404).json({ error: 'Job opening not found' });
    }
    res.json(jobOpening);
  } catch (error) {
    console.error('Error fetching job opening:', error);
    res.status(500).json({ error: 'Failed to fetch job opening' });
  }
});

app.get('/api/company-info/section/:section', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const section = req.params.section;
    const companyInfo = await storage.getCompanyInfoBySection(section);
    res.json(companyInfo);
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ error: 'Failed to fetch company info' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    const contactSubmission = await storage.createContactSubmission(req.body);
    res.status(201).json({ 
      message: 'Contact form submitted successfully', 
      id: contactSubmission.id 
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Find user
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password
    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Set session
    req.session.userId = user.id;
    req.session.userRole = user.role;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', isAuthenticated, async (req, res) => {
  try {
    if (!storage) {
      return res.status(503).json({ error: 'Database not initialized' });
    }
    
    const user = await storage.getUser(req.session.userId);
    
    if (!user) {
      req.session.destroy();
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Auth status endpoint (for debugging)
app.get('/api/auth/status', (req, res) => {
  res.json({
    isAuthenticated: req.session && req.session.userId ? true : false,
    session: {
      userId: req.session?.userId,
      userRole: req.session?.userRole,
    }
  });
});

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Export the serverless function
module.exports.handler = serverless(app);