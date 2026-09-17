/**
 * Auth Service
 * Business logic for authentication operations
 */

const bcrypt = require('bcryptjs');
const { signToken } = require('../config/jwt');
const workerRepository = require('../repositories/worker.repository');
const ApiError = require('../utils/ApiError');

class AuthService {
  /**
   * Authenticate a user with username and password
   * @param {string} username
   * @param {string} password
   * @returns {{ token: string, user: Object }}
   */
  async login(username, password) {
    // 1. Find user by username (with password hash)
    const user = await workerRepository.findByUsername(username);
    if (!user) {
      // Use a generic message to prevent username enumeration attacks
      throw new ApiError('Invalid username or password', 401);
    }

    // 2. Check account is active
    if (!user.active) {
      throw new ApiError('Your account has been deactivated. Contact administrator.', 403);
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid username or password', 401);
    }

    // 4. Sign JWT
    const token = signToken({ id: user.id, username: user.username, role: user.role });

    // 5. Return token + sanitized user (no password)
    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  /**
   * Get the profile of the currently authenticated user
   * @param {number} userId
   */
  async getProfile(userId) {
    const user = await workerRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  /**
   * Register a new user (worker)
   * @param {string} fullName
   * @param {string} username
   * @param {string} password
   * @returns {{ token: string, user: Object }}
   */
  async register(fullName, username, password) {
    // 1. Check if username already exists
    const existingUser = await workerRepository.findByUsername(username);
    if (existingUser) {
      throw new ApiError('Username already exists', 409);
    }

    // 2. Hash password
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Create new worker (default role: WORKER)
    const newUser = await workerRepository.create({
      fullName,
      username,
      password: hashedPassword,
      role: 'WORKER',
      active: true,
    });

    // 4. Sign JWT
    const token = signToken({ id: newUser.id, username: newUser.username, role: newUser.role });

    // 5. Return token + sanitized user (no password)
    const { password: _, ...safeUser } = newUser;
    return { token, user: safeUser };
  }
}

module.exports = new AuthService();
