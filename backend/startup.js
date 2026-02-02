#!/usr/bin/env node

/**
 * Startup script to initialize the application
 * Creates necessary directories and sets up initial data
 */

const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('[INFO] Created uploads directory');
}

// Create .gitkeep file
const gitkeepPath = path.join(uploadsDir, '.gitkeep');
if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, '');
  console.log('[INFO] Created .gitkeep file');
}

console.log('[INFO] Startup initialization complete');
