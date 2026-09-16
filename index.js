/**
 * Vehicle Fuel Management System — Server Entry Point
 *
 * Bootstraps the Express application with all security middleware,
 * route mounting, and error handling.
 */

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const routes = require('./src/routes/index');
const errorHandler = require('./src/middlewares/errorHandler');
const notFound = require('./src/middlewares/notFound');
const logger = require('./src/config/logger');
const prisma = require('./src/config/database');

// ─── App Setup ─────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ───────────────────────────────────────────────────────

// Helmet: Sets various HTTP security headers
app.use(helmet());

// CORS: Cross-Origin Resource Sharing
app.use(
  cors({
    origin: "https://vehicle-system-frontend.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Rate Limiting: Prevent abuse and brute-force attacks
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

// Stricter rate limit on auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});
app.use('/api/auth/login', authLimiter);

// ─── Parsing & Compression ────────────────────────────────────────────────────

// Gzip compression for responses
app.use(compression());

// JSON body parser (10mb limit for safety)
app.use(express.json({ limit: '10mb' }));

// URL-encoded body parser (extended for FormData support)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware to log request body
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path.includes('fuel-logs')) {
    console.log('=== DEBUG MIDDLEWARE ===');
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Body:', req.body);
    console.log('Body type:', typeof req.body);
    console.log('Raw body:', req.body);
  }
  next();
});

// ─── Logging ──────────────────────────────────────────────────────────────────

// HTTP request logging via Morgan → Winston
const morganStream = { write: (message) => logger.http(message.trim()) };
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream: morganStream },
  ),
);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── Root Endpoint ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '⛽ Vehicle Fuel Management System API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      workers: '/api/workers',
      fuelLogs: '/api/fuel-logs',
      dashboard: '/api/dashboard',
      reports: '/api/reports',
    },
  });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
// 404 handler — must come after all routes
app.use(notFound);

// Global error handler — must be last and have 4 parameters
app.use(errorHandler);

// ─── Database Connection & Server Start ──────────────────────────────────────
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅  Database connected successfully');

    // Only start server if not running in Vercel
    if (process.env.VERCEL !== '1') {
      app.listen(PORT, () => {
        logger.info(`🚀  Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
        logger.info(`📡  API available at: http://localhost:${PORT}/api`);
        logger.info(`❤️   Health check:    http://localhost:${PORT}/api/health`);
      });
    }
  } catch (error) {
    logger.error('❌  Failed to connect to database:', error);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  logger.info(`\n${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
  logger.info('Database disconnected. Exiting.');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Export app for Vercel serverless
module.exports = app;

// Start server only if not in Vercel
if (process.env.VERCEL !== '1') {
  startServer();
}
