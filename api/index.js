const express = require('express');
const app = express();

// JSON body parser for Vercel serverless functions
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import the main app
const server = require('../index');

// Use the main app's middleware and routes
app.use(server);

module.exports = app;
