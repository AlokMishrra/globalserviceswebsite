#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}===== GLOBAL SERVICES WEBSITE - NETLIFY BUILD SCRIPT =====${colors.reset}`);

// Create the client/dist directory if it doesn't exist
if (!fs.existsSync('client/dist')) {
  fs.mkdirSync('client/dist', { recursive: true });
}

// Create the functions directory if it doesn't exist
if (!fs.existsSync('functions')) {
  fs.mkdirSync('functions', { recursive: true });
}

// Function to execute commands
function execCommand(command, message) {
  console.log(`\n${colors.yellow}${message}...${colors.reset}`);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`${colors.red}ERROR: ${error.message}${colors.reset}`);
        console.error(stderr);
        reject(error);
        return;
      }
      if (stdout) console.log(stdout);
      console.log(`${colors.green}✓ ${message} completed${colors.reset}`);
      resolve();
    });
  });
}

// Main build process
async function build() {
  try {
    // Set NODE_ENV to production
    process.env.NODE_ENV = 'production';

    // Build the client
    await execCommand('npm run build', 'Building client');
    
    // Copy netlify.toml
    if (fs.existsSync('netlify.toml')) {
      console.log(`\n${colors.yellow}Netlify configuration found${colors.reset}`);
    } else {
      console.error(`${colors.red}ERROR: netlify.toml not found${colors.reset}`);
      process.exit(1);
    }

    // Verify serverless functions exist
    if (fs.existsSync('functions/api.js')) {
      console.log(`${colors.green}✓ API function found${colors.reset}`);
    } else {
      console.error(`${colors.red}ERROR: functions/api.js not found${colors.reset}`);
      process.exit(1);
    }

    if (fs.existsSync('functions/upload-handler.js')) {
      console.log(`${colors.green}✓ Upload handler function found${colors.reset}`);
    } else {
      console.error(`${colors.red}ERROR: functions/upload-handler.js not found${colors.reset}`);
      process.exit(1);
    }

    if (fs.existsSync('functions/create-admin.js')) {
      console.log(`${colors.green}✓ Admin creation function found${colors.reset}`);
    } else {
      console.error(`${colors.red}ERROR: functions/create-admin.js not found${colors.reset}`);
      process.exit(1);
    }

    console.log(`\n${colors.bright}${colors.green}===== BUILD COMPLETED SUCCESSFULLY =====${colors.reset}`);
    console.log(`\n${colors.cyan}Deployment Instructions:${colors.reset}`);
    console.log(`1. Make sure to set the following environment variables in your Netlify dashboard:
   - DATABASE_URL: Your PostgreSQL connection string
   - SESSION_SECRET: A random string for session encryption
   - NODE_ENV: Set to "production"`);
    console.log(`2. Admin credentials (automatically created on first run):
   - Username: admin
   - Password: admin123
   (Remember to change this password after first login)`);

  } catch (error) {
    console.error(`\n${colors.bright}${colors.red}===== BUILD FAILED =====${colors.reset}`);
    process.exit(1);
  }
}

// Run the build process
build();