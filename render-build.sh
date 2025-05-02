#!/bin/bash
# This script is specifically for Render deployment

# Debug information
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Check if package.json.render exists
if [ -f "package.json.render" ]; then
  echo "Using simplified package.json.render for core dependencies"
  cp package.json.render package.json
fi

# Install dependencies explicitly
echo "Installing core dependencies..."
npm install --no-package-lock

# Install Vite and related packages globally and locally
echo "Installing Vite and plugins..."
npm install -g vite
npm install --save vite@latest @vitejs/plugin-react esbuild

# Build the application
echo "Building frontend..."
export NODE_ENV=production
npx vite build

echo "Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed!"
