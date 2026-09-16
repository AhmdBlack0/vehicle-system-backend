/**
 * Role-Based Access Control Middleware
 * Restricts route access based on user roles
 */

const ApiError = require('../utils/ApiError');

/**
 * Authorize access for specific roles
 * @param {...string} roles - Allowed roles (e.g., 'ADMIN', 'WORKER')
 * @returns {import('express').RequestHandler}
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
          403,
        ),
      );
    }

    next();
  };
};

/**
 * Shorthand: Admin-only routes
 */
const adminOnly = authorize('ADMIN');

/**
 * Shorthand: Worker and Admin routes
 */
const workerAndAdmin = authorize('WORKER', 'ADMIN');

module.exports = { authorize, adminOnly, workerAndAdmin };
