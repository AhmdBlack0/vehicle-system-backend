/**
 * Custom API Error Class
 * Extends the native Error with HTTP status code support
 */

class ApiError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {any[]} [errors] - Optional array of validation errors
   */
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Distinguishes operational errors from programming bugs

    // Capture stack trace (excludes ApiError constructor from it)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
