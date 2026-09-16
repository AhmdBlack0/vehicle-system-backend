const express = require('express');
const app = express();

// Body parsers MUST be here for Vercel serverless functions
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
  console.log('=== API INDEX DEBUG ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Body:', req.body);
  console.log('Body type:', typeof req.body);
  next();
});

// Import and use the main app as middleware
const mainApp = require('../index');
app.use(mainApp);

module.exports = app;
