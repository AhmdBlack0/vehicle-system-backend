/**
 * Fuel Log Controller
 * Handles HTTP requests for fuel logging operations
 */

const fuelLogService = require('../services/fuelLog.service');
const { createFuelLogSchema } = require('../validators/fuelLog.validator');
const { sendSuccess } = require('../utils/response');

class FuelLogController {
  /**
   * GET /api/fuel-logs
   * List all fuel logs with optional filters and pagination
   */
  async listFuelLogs(req, res, next) {
    try {
      const result = await fuelLogService.listFuelLogs(req.query);
      return sendSuccess(res, 200, 'Fuel logs retrieved successfully', result.fuelLogs, {
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
   * GET /api/fuel-logs/:id
   * Get a single fuel log by ID
   */
  async getFuelLogById(req, res, next) {
    try {
      const log = await fuelLogService.getFuelLogById(parseInt(req.params.id));
      return sendSuccess(res, 200, 'Fuel log retrieved successfully', log);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/fuel-logs
   * Create a new fuel log entry
   * The worker ID is taken from the authenticated JWT token
   */
  async createFuelLog(req, res, next) {
    try {
      console.log('Request body:', req.body);
      const data = createFuelLogSchema.parse(req.body);
      console.log('Parsed data:', data);
      const log = await fuelLogService.createFuelLog(data, req.user.id);
      return sendSuccess(res, 201, 'Fuel log created successfully', log);
    } catch (error) {
      console.error('Error in createFuelLog:', error);
      next(error);
    }
  }

}

module.exports = new FuelLogController();
