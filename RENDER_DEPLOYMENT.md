# Render Deployment Guide for Global Services Website

This guide provides step-by-step instructions for deploying this application to Render.

## Easy Deployment with Blueprint (Recommended)

The easiest way to deploy this application is using the Render Blueprint (render.yaml file):

1. Go to https://dashboard.render.com/blueprints
2. Click "New Blueprint Instance"
3. Connect your GitHub account if you haven't already
4. Select the repository: AlokMishrra/globalserviceswebsite
5. Click "Apply Blueprint"
6. Render will automatically create and deploy:
   - A PostgreSQL database for your application
   - A Web Service that runs your application

After deployment is complete, you can access your application at the URL provided by Render.

## Manual Deployment

If you prefer to deploy manually:

### Step 1: Create a PostgreSQL Database

1. In your Render dashboard, click "New" and select "PostgreSQL"
2. Configure your database:
   - Name: globalservices-db
   - Database: globalservices
   - User: Leave as default
   - Region: Choose closest to your users
   - Plan: Free (or paid plan based on your needs)
3. Click "Create Database"
4. Copy the "Internal Database URL" after it's created

### Step 2: Deploy the Web Service

1. In your Render dashboard, click "New" and select "Web Service"
2. Connect to your GitHub repository (AlokMishrra/globalserviceswebsite)
3. Configure the web service:
   - Name: globalservices-website
   - Region: Same as your database
   - Branch: main
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free (or paid plan based on your needs)
4. Add Environment Variables:
   - DATABASE_URL: Paste the Internal Database URL from Step 1
   - SESSION_SECRET: Generate a random string
   - NODE_ENV: production
5. Click "Create Web Service"

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Render dashboard
2. Ensure all environment variables are correctly set
3. Verify your database connection is working
4. Check the application logs for runtime errors

## Managing Your Deployment

After successful deployment:

- You can manage your services from the Render dashboard
- Set up auto-deployment by connecting your GitHub repository
- Monitor logs and performance metrics
- Scale your application as needed
