/**
 * Global Error Handler Middleware
 * Maps known error types to appropriate HTTP responses
 */

const { Prisma } = require('@prisma/client');
const { ZodError } = require('zod');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { sendError } = require('../utils/response');

/**
 * Express global error handler — must be registered last with 4 parameters
 */
const errorHandler = (err, req, res, next) => {
  // ─── Log the error ──────────────────────────────────────────────────────────
  logger.error(`${err.constructor.name}: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // ─── Zod Validation Errors ─────────────────────────────────────────────────
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 422, 'Validation failed', errors);
  }

  // ─── Custom API Errors ─────────────────────────────────────────────────────
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  // ─── Prisma: Record Not Found ──────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return sendError(res, 404, 'Record not found');
    }
    if (err.code === 'P2002') {
      const field = err.meta?.target?.join(', ') || 'field';
      return sendError(res, 409, `A record with this ${field} already exists`);
    }
    if (err.code === 'P2003') {
      return sendError(res, 400, 'Foreign key constraint failed — related record not found');
    }
    return sendError(res, 400, `Database error: ${err.message}`);
  }

  // ─── Prisma: Validation Errors ─────────────────────────────────────────────
  if (err instanceof Prisma.PrismaClientValidationError) {
    return sendError(res, 400, 'Invalid data provided to database');
  }

  // ─── JWT Errors ───────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token has expired');
  }

  // ─── Generic/Unknown Errors ────────────────────────────────────────────────
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
