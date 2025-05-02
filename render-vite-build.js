// A simplified build script specifically for Render that doesn't use Vite directly
// This uses Node.js APIs to avoid the direct Vite dependency issue

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Log environment for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PATH:', process.env.PATH);
console.log('Current directory:', process.cwd());

// Helper function to run shell commands
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);
    
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      
      resolve();
    });
  });
};

// Main build function
async function build() {
  try {
    // Install dependencies first
    await runCommand('npm install --prefer-offline --no-audit --progress=false');
    
    // Install Vite globally and locally
    await runCommand('npm install -g vite');
    await runCommand('npm install vite @vitejs/plugin-react --no-save');
    
    // Create client dist directory
    const distDir = path.join(__dirname, 'dist', 'public');
    fs.mkdirSync(distDir, { recursive: true });
    
    // Build server
    console.log('\n📦 Building server...');
    await runCommand('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');
    
    // Copy static assets for client (since we're skipping Vite)
    console.log('\n📦 Copying client assets...');
    const clientDir = path.join(__dirname, 'client');
    const staticAssetsDir = path.join(clientDir, 'public');
    
    if (fs.existsSync(staticAssetsDir)) {
      await runCommand(`cp -r ${staticAssetsDir}/* ${distDir}`);
    }
    
    // Create a simple HTML file if needed
    fs.writeFileSync(
      path.join(distDir, 'index.html'),
      '<html><head><title>Global Services</title></head><body><div id="root"></div><script type="module" src="/main.js"></script></body></html>'
    );
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
