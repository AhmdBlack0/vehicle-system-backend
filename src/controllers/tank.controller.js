/**
 * Tank Controller
 * Handles HTTP requests for tank management operations
 */

const tankService = require('../services/tank.service');
const { addFuelToTankSchema } = require('../validators/tank.validator');
const { sendSuccess } = require('../utils/response');

class TankController {
  /**
   * GET /api/tank
   * Get tank information with current balance and summary
   */
  async getTankInfo(req, res, next) {
    try {
      const tank = await tankService.getTankInfo();
      return sendSuccess(res, 200, 'Tank information retrieved successfully', tank);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tank/add
   * Add fuel to the tank
   */
  async addFuelToTank(req, res, next) {
    try {
      const data = addFuelToTankSchema.parse(req.body);
      const tank = await tankService.addFuelToTank(data, req.user.id);
      return sendSuccess(res, 201, 'Fuel added to tank successfully', tank);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tank/transactions
   * Get tank transactions with optional filters and pagination
   */
  async getTransactions(req, res, next) {
    try {
      const result = await tankService.getTransactions(req.query);
      return sendSuccess(res, 200, 'Tank transactions retrieved successfully', result.transactions, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tank/user-transactions
   * Get tank transactions for the authenticated user
   */
  async getUserTransactions(req, res, next) {
    try {
      const result = await tankService.getUserTransactions(req.user.id, req.query);
      return sendSuccess(res, 200, 'User tank transactions retrieved successfully', result.transactions, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TankController();
