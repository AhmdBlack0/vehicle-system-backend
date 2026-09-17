/**
 * Standardized API Response Helper
 * All API responses follow the same envelope structure
 */

/**
 * Send a success response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} data
 * @param {Object} [meta] - Optional pagination or extra metadata
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any[]} [errors]
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = []) => {
  const response = {
    success: false,
    message,
  };
  if (errors && errors.length > 0) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
