/**
 * Fuel Log Routes
 *
 * GET  /api/fuel-logs      — List fuel logs (admin)
 * POST /api/fuel-logs      — Create fuel log (worker + admin)
 * GET  /api/fuel-logs/:id  — Get fuel log by ID (auth)
 */

const express = require('express');
const router = express.Router();
const fuelLogController = require('../controllers/fuelLog.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { adminOnly, workerAndAdmin } = require('../middlewares/role.middleware');

router.use(authenticate);

router
  .route('/')
  .get(adminOnly, fuelLogController.listFuelLogs.bind(fuelLogController))
  .post(workerAndAdmin, fuelLogController.createFuelLog.bind(fuelLogController));

router.get('/:id', fuelLogController.getFuelLogById.bind(fuelLogController));

module.exports = router;
