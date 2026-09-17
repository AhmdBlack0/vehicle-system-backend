/**
 * Auth Controller
 * Handles HTTP requests for authentication endpoints
 */

const authService = require('../services/auth.service');
const { loginSchema, registerSchema } = require('../validators/auth.validator');
const { sendSuccess } = require('../utils/response');

class AuthController {
  /**
   * POST /api/auth/login
   * Authenticate user and return JWT token
   */
  async login(req, res, next) {
    try {
      // Validate request body
      const { username, password } = loginSchema.parse(req.body);

      const { token, user } = await authService.login(username, password);

      return sendSuccess(res, 200, 'Login successful', { token, user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/register
   * Register a new user (worker) and return JWT token
   */
  async register(req, res, next) {
    try {
      // Validate request body
      const { fullName, username, password } = registerSchema.parse(req.body);

      const { token, user } = await authService.register(fullName, username, password);

      return sendSuccess(res, 201, 'Registration successful', { token, user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Get the currently authenticated user's profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return sendSuccess(res, 200, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
