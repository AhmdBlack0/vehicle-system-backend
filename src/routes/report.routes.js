/**
 * Report Routes
 *
 * GET /api/reports/vehicle/:id  — Fuel history per vehicle
 * GET /api/reports/worker/:id   — Fuel history per worker
 * GET /api/reports/daily        — Daily report
 * GET /api/reports/monthly      — Monthly report
 * GET /api/reports/range        — Date range search
 */

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

// All reports are admin-only
router.use(authenticate, adminOnly);

router.get('/vehicle/:id', reportController.getVehicleReport.bind(reportController));
router.get('/worker/:id', reportController.getWorkerReport.bind(reportController));
router.get('/daily', reportController.getDailyReport.bind(reportController));
router.get('/monthly', reportController.getMonthlyReport.bind(reportController));
router.get('/range', reportController.getDateRangeReport.bind(reportController));

module.exports = router;
