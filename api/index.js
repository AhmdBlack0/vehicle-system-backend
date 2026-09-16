const express = require('express');
const app = express();

// Body parsers MUST be here for Vercel serverless functions
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import and use the main app as middleware
const mainApp = require('../index');
app.use(mainApp);

module.exports = app;
