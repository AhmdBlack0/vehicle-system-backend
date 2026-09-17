/**
 * 404 Not Found Middleware
 * Catches all unmatched routes
 */

const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(new ApiError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

module.exports = notFound;
