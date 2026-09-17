/**
 * Vehicle Routes
 *
 * GET    /api/vehicles                     — List vehicles (auth)
 * POST   /api/vehicles                     — Create vehicle (admin)
 * POST   /api/vehicles/scan-qr             — Scan QR code image (auth)
 * GET    /api/vehicles/barcode/:barcode    — Get by barcode (auth) ← Must be before /:id
 * GET    /api/vehicles/:id                 — Get by ID (auth)
 * PUT    /api/vehicles/:id                 — Update vehicle (admin)
 * DELETE /api/vehicles/:id                 — Delete vehicle (admin)
 * GET    /api/vehicles/:id/barcode         — Download barcode PNG (auth)
 */

const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

// All vehicle routes require authentication
router.use(authenticate);

// ── List & Create ──────────────────────────────────────────────────────────────
router
  .route('/')
  .get(vehicleController.listVehicles.bind(vehicleController))
  .post(adminOnly, vehicleController.createVehicle.bind(vehicleController));

// ── Scan QR Code ───────────────────────────────────────────────────────────────
router.post('/scan-qr', vehicleController.scanQRCode.bind(vehicleController));

// ── Barcode Lookup (MUST be before /:id to avoid route conflict) ───────────────
router.get('/barcode/:barcode', vehicleController.getVehicleByBarcode.bind(vehicleController));

// ── Single Vehicle by ID ───────────────────────────────────────────────────────
router
  .route('/:id')
  .get(vehicleController.getVehicleById.bind(vehicleController))
  .put(adminOnly, vehicleController.updateVehicle.bind(vehicleController))
  .delete(adminOnly, vehicleController.deleteVehicle.bind(vehicleController));

// ── Barcode PNG Download ───────────────────────────────────────────────────────
router.get('/:id/barcode', vehicleController.downloadBarcode.bind(vehicleController));

module.exports = router;
