/**
 * Report Controller
 * Handles HTTP requests for reporting endpoints
 */

const reportService = require('../services/report.service');
const { sendSuccess } = require('../utils/response');

class ReportController {
  /**
   * GET /api/reports/vehicle/:id
   * Fuel history for a specific vehicle
   * Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&page=1&limit=20
   */
  async getVehicleReport(req, res, next) {
    try {
      const result = await reportService.getVehicleReport(
        parseInt(req.params.id),
        req.query,
      );
      return sendSuccess(res, 200, 'Vehicle fuel report retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports/worker/:id
   * Fuel history for a specific worker
   * Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&page=1&limit=20
   */
  async getWorkerReport(req, res, next) {
    try {
      const result = await reportService.getWorkerReport(
        parseInt(req.params.id),
        req.query,
      );
      return sendSuccess(res, 200, 'Worker fuel report retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports/daily
   * Daily fuel report
   * Query: ?date=YYYY-MM-DD (defaults to today)
   */
  async getDailyReport(req, res, next) {
    try {
      const result = await reportService.getDailyReport(req.query.date);
      return sendSuccess(res, 200, 'Daily fuel report retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports/monthly
   * Monthly fuel report
   * Query: ?year=2024&month=6 (defaults to current month)
   */
  async getMonthlyReport(req, res, next) {
    try {
      const result = await reportService.getMonthlyReport(req.query.year, req.query.month);
      return sendSuccess(res, 200, 'Monthly fuel report retrieved', result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/reports/range
   * Date range fuel report
   * Query: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&page=1&limit=20 (required)
   */
  async getDateRangeReport(req, res, next) {
    try {
      const result = await reportService.getDateRangeReport(req.query);
      return sendSuccess(res, 200, 'Date range fuel report retrieved', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
