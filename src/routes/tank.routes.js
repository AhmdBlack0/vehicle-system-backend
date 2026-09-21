/**
 * Tank Routes
 *
 * GET  /api/tank                 — Get tank info (admin + worker)
 * POST /api/tank/add            — Add fuel to tank (admin + worker)
 * GET  /api/tank/transactions   — List tank transactions (admin)
 * GET  /api/tank/user-transactions — List user tank transactions (worker + admin)
 */

const express = require('express');
const router = express.Router();
const tankController = require('../controllers/tank.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { adminOnly, workerAndAdmin } = require('../middlewares/role.middleware');

router.use(authenticate);

router.get('/', workerAndAdmin, tankController.getTankInfo.bind(tankController));
router.post('/add', workerAndAdmin, tankController.addFuelToTank.bind(tankController));
router.get('/transactions', adminOnly, tankController.getTransactions.bind(tankController));
router.get('/user-transactions', workerAndAdmin, tankController.getUserTransactions.bind(tankController));

module.exports = router;
