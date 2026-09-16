/**
 * Dashboard Routes
 *
 * GET /api/dashboard — Summary stats (admin only)
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

router.get('/', authenticate, adminOnly, dashboardController.getSummary.bind(dashboardController));

module.exports = router;
