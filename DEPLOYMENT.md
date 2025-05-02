# Deployment Guide for Global Services Website

This guide provides detailed instructions on how to deploy the Global Services Website to Netlify or your own server.

## Option 1: Deploying to Netlify (Recommended)

### Prerequisites
- A Netlify account
- A PostgreSQL database (we recommend Neon, Supabase, or Railway for easy setup)
- Your project code in a GitHub repository

### Step 1: Prepare Your Database
1. Set up a PostgreSQL database with your preferred provider
2. Note down the database connection string - you'll need it later

### Step 2: Connect to Netlify
1. Log in to your Netlify account
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, etc.)
4. Select your repository
5. Configure build settings (should be pre-configured in netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `client/dist`

### Step 3: Set Environment Variables
In the Netlify site dashboard, go to Settings > Environment variables and add:
1. `DATABASE_URL` - Your PostgreSQL connection string
2. `SESSION_SECRET` - A secure random string for session encryption
3. `NODE_ENV` - Set to `production`

### Step 4: Deploy
1. Click "Deploy site"
2. Wait for the build process to complete
3. Once deployed, Netlify will provide a URL for your site

### Step 5: Set Up Database Schema
1. Clone your repository locally
2. Configure your local .env file with the same DATABASE_URL
3. Run `npm run db:push` to set up the database schema
4. The admin user (username: "admin", password: "admin123") will be created automatically on first run

### Step 6: Test Your Site
1. Visit your Netlify URL
2. Test all functionality, especially:
   - Public pages
   - Admin login
   - Content management in the admin panel
   - Image uploads
   - Contact form submissions

## Option 2: Self-Hosting

### Prerequisites
- A server with Node.js installed (v18+ recommended)
- A PostgreSQL database
- Nginx or another web server (for production)

### Step 1: Set Up Your Server
1. Clone your repository to your server
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with:
   ```
   DATABASE_URL=your_postgres_connection_string
   SESSION_SECRET=your_secure_random_string
   NODE_ENV=production
   ```

### Step 2: Build the Project
```
npm run build
```

### Step 3: Set Up the Database
```
npm run db:push
```

### Step 4: Start the Server
For testing:
```
npm run start
```

For production, use a process manager like PM2:
```
npm install -g pm2
pm2 start dist/index.js --name "global-services"
```

### Step 5: Set Up Nginx (for Production)
Configure Nginx as a reverse proxy to your Node.js application:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 6: Set Up SSL with Let's Encrypt
1. Install Certbot
2. Run:
   ```
   certbot --nginx -d yourdomain.com
   ```

## Troubleshooting

### Database Connection Issues
- Ensure your DATABASE_URL is correctly formatted
- Check that your database server allows connections from your deployment
- For Netlify, make sure you've properly set environment variables

### Authentication Problems
- Verify SESSION_SECRET is set correctly
- Check cookie settings in the auth configuration

### File Upload Issues
- Ensure the uploads directory exists and is writable
- Check file size limits in your serverless function configuration
- Verify paths are correct in the Netlify redirects

### General Debugging
- Check Netlify function logs in the Netlify dashboard
- For self-hosting, check your server logs
- Enable more verbose logging temporarily by adding `console.log` statements

## Maintenance

### Database Backups
Set up regular backups of your PostgreSQL database to prevent data loss.

### Updates
1. Pull the latest changes from your repository
2. Run `npm install` to update dependencies
3. Run `npm run build` to rebuild
4. Restart your server (if self-hosting) or trigger a new deploy on Netlify

### Monitoring
Consider setting up monitoring for your application to track performance and uptime.

---

For additional help or questions, please refer to the documentation or contact support.