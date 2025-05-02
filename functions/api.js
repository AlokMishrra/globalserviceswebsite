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
app.use(session({
  secret: process.env.SESSION_SECRET || 'global-services-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none'
  }
}));

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
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  };
  
  initDb();
}

// API endpoints
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

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Export the serverless function
module.exports.handler = serverless(app);