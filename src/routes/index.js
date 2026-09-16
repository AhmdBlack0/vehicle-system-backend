/**
 * Routes Index — Aggregates all route modules
 * Mounted under /api
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const vehicleRoutes = require('./vehicle.routes');
const workerRoutes = require('./worker.routes');
const fuelLogRoutes = require('./fuelLog.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportRoutes = require('./report.routes');

// ── Health Check ──────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Vehicle Fuel Management System API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── Module Routes ──────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/workers', workerRoutes);
router.use('/fuel-logs', fuelLogRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
