/**
 * Dashboard Controller
 * Returns aggregated statistics for the admin dashboard
 */

const dashboardService = require('../services/dashboard.service');
const { sendSuccess } = require('../utils/response');

class DashboardController {
  /**
   * GET /api/dashboard
   * Returns:
   *  - Total & active vehicles
   *  - Total & active workers
   *  - Today's fuel operations & cost
   *  - Monthly fuel operations & cost
   */
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummary();
      return sendSuccess(res, 200, 'Dashboard data retrieved successfully', summary);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
