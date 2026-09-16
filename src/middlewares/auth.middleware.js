/**
 * JWT Authentication Middleware
 * Verifies the Bearer token and attaches the decoded user to req.user
 */

const { verifyToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const prisma = require('../config/database');

/**
 * Protect routes — requires a valid JWT in the Authorization header
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No authentication token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ApiError('Authentication token has expired', 401);
      }
      throw new ApiError('Invalid authentication token', 401);
    }

    // 3. Check user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, fullName: true, username: true, role: true, active: true },
    });

    if (!user) {
      throw new ApiError('User associated with this token no longer exists', 401);
    }

    if (!user.active) {
      throw new ApiError('Your account has been deactivated. Contact administrator.', 403);
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate };
