/**
 * Auth Routes
 * POST /api/auth/register
 * POST /api/auth/login
 * GET  /api/auth/me
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Public routes — no auth required
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected route — requires valid JWT
router.get('/me', authenticate, authController.getProfile.bind(authController));

module.exports = router;
