/**
 * Worker Routes
 *
 * GET    /api/workers         — List workers (admin)
 * POST   /api/workers         — Create worker (admin)
 * GET    /api/workers/:id     — Get worker by ID (admin)
 * GET    /api/workers/:id/history — Get worker fuel history (admin or own history)
 * PUT    /api/workers/:id     — Update worker (admin)
 * DELETE /api/workers/:id     — Delete worker (admin)
 */

const express = require('express');
const router = express.Router();
const workerController = require('../controllers/worker.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');

// All routes require authentication
router.use(authenticate);

// ── List & Create (Admin only) ────────────────────────────────────────────────
router
  .route('/')
  .get(adminOnly, workerController.listWorkers.bind(workerController))
  .post(adminOnly, workerController.createWorker.bind(workerController));

// ── Worker History (Admin or own history) ───────────────────────────────────────
router.get('/:id/history', workerController.getWorkerHistory.bind(workerController));

// ── Single Worker by ID (Admin only) ───────────────────────────────────────────
router
  .route('/:id')
  .get(adminOnly, workerController.getWorkerById.bind(workerController))
  .put(adminOnly, workerController.updateWorker.bind(workerController))
  .delete(adminOnly, workerController.deleteWorker.bind(workerController));

module.exports = router;
