// Build script to prepare project for deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting build process for deployment...');

// Create the dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

try {
  // Build the client
  console.log('📦 Building client...');
  execSync('vite build', { stdio: 'inherit' });
  console.log('✅ Client build completed');
  
  // Build the serverless functions
  console.log('📦 Preparing serverless functions...');
  if (!fs.existsSync('functions')) {
    console.log('⚠️ Functions directory not found, creating it...');
    fs.mkdirSync('functions');
  }

  // Check if essential files exist in functions directory
  if (!fs.existsSync('functions/api.js')) {
    console.error('❌ Error: functions/api.js not found.');
    process.exit(1);
  }
  
  console.log('✅ Serverless functions prepared');
  
  // Ensure netlify.toml exists
  if (!fs.existsSync('netlify.toml')) {
    console.error('❌ Error: netlify.toml not found.');
    process.exit(1);
  }
  
  console.log('🎉 Build process completed successfully!');
  console.log('\nDeployment instructions:');
  console.log('1. Connect your GitHub repository to Netlify');
  console.log('2. Configure the following environment variables in Netlify:');
  console.log('   - DATABASE_URL: Your database connection string');
  console.log('   - SESSION_SECRET: A secure random string for session encryption');
  console.log('   - NODE_ENV: Set to "production"');
  console.log('3. Deploy your site from the Netlify dashboard');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}