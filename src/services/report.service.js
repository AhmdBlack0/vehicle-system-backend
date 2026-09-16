/**
 * Report Service
 * Generates fuel operation reports with various groupings
 */

const fuelLogRepository = require('../repositories/fuelLog.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const workerRepository = require('../repositories/worker.repository');
const ApiError = require('../utils/ApiError');

class ReportService {
  /**
   * Fuel history per vehicle
   * @param {number} vehicleId
   * @param {Object} query - Pagination and date filters
   */
  async getVehicleReport(vehicleId, query) {
    // Validate vehicle exists
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(`Vehicle with ID ${vehicleId} not found`, 404);
    }

    // If 'all' is true, return all records without pagination
    if (query.all === 'true' || query.all === true) {
      const fuelLogs = await fuelLogRepository.findAllWithoutPagination({
        vehicleId,
        startDate: query.startDate,
        endDate: query.endDate,
      });

      const totalCost = fuelLogs.reduce(
        (sum, log) => sum + Number(log.totalPrice),
        0,
      );

      return {
        vehicle,
        fuelLogs,
        totalCost: Math.round(totalCost * 100) / 100,
        total: fuelLogs.length,
      };
    }

    // Default pagination
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);

    const result = await fuelLogRepository.findAll({
      vehicleId,
      startDate: query.startDate,
      endDate: query.endDate,
      page,
      limit,
    });

    // Compute totals for the filtered result
    const totalCost = result.fuelLogs.reduce(
      (sum, log) => sum + Number(log.totalPrice),
      0,
    );

    return {
      vehicle,
      fuelLogs: result.fuelLogs,
      totalCost: Math.round(totalCost * 100) / 100,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /**
   * Fuel history per worker
   * @param {number} workerId
   * @param {Object} query - Pagination and date filters
   */
  async getWorkerReport(workerId, query) {
    // Validate worker exists
    const worker = await workerRepository.findById(workerId);
    if (!worker) {
      throw new ApiError(`Worker with ID ${workerId} not found`, 404);
    }

    // If 'all' is true, return all records without pagination
    if (query.all === 'true' || query.all === true) {
      const fuelLogs = await fuelLogRepository.findAllWithoutPagination({
        workerId,
        startDate: query.startDate,
        endDate: query.endDate,
      });

      const totalCost = fuelLogs.reduce(
        (sum, log) => sum + Number(log.totalPrice),
        0,
      );

      return {
        worker,
        fuelLogs,
        totalCost: Math.round(totalCost * 100) / 100,
        total: fuelLogs.length,
      };
    }

    // Default pagination
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);

    const result = await fuelLogRepository.findAll({
      workerId,
      startDate: query.startDate,
      endDate: query.endDate,
      page,
      limit,
    });

    const totalCost = result.fuelLogs.reduce(
      (sum, log) => sum + Number(log.totalPrice),
      0,
    );

    return {
      worker,
      fuelLogs: result.fuelLogs,
      totalCost: Math.round(totalCost * 100) / 100,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  /**
   * Daily fuel report
   * @param {string} date - Date string (YYYY-MM-DD), defaults to today
   */
  async getDailyReport(date) {
    const targetDate = date ? new Date(date) : new Date();

    // Validate date
    if (isNaN(targetDate.getTime())) {
      throw new ApiError('Invalid date format. Use YYYY-MM-DD', 400);
    }

    const logs = await fuelLogRepository.getDailyReport(targetDate);

    const summary = logs.reduce(
      (acc, log) => {
        acc.totalCost += Number(log.totalPrice);
        acc.totalQuantity += Number(log.fuelQuantity);
        acc.totalOperations++;
        return acc;
      },
      { totalCost: 0, totalQuantity: 0, totalOperations: 0 },
    );

    return {
      date: targetDate.toISOString().split('T')[0],
      summary: {
        totalCost: Math.round(summary.totalCost * 100) / 100,
        totalQuantity: Math.round(summary.totalQuantity * 100) / 100,
        totalOperations: summary.totalOperations,
      },
      logs,
    };
  }

  /**
   * Monthly fuel report
   * @param {number} year - Full year (e.g., 2024)
   * @param {number} month - Month number 1-12
   */
  async getMonthlyReport(year, month) {
    const y = parseInt(year) || new Date().getFullYear();
    const m = parseInt(month) || new Date().getMonth() + 1;

    if (m < 1 || m > 12) {
      throw new ApiError('Month must be between 1 and 12', 400);
    }

    return fuelLogRepository.getMonthlyReport(y, m);
  }

  /**
   * Date range fuel report
   * @param {Object} query - { startDate, endDate, page, limit, all }
   */
  async getDateRangeReport(query) {
    if (!query.startDate || !query.endDate) {
      throw new ApiError('Both startDate and endDate are required (YYYY-MM-DD)', 400);
    }

    const start = new Date(query.startDate);
    const end = new Date(query.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ApiError('Invalid date format. Use YYYY-MM-DD', 400);
    }

    if (start > end) {
      throw new ApiError('startDate must be before or equal to endDate', 400);
    }

    // If 'all' is true, return all records without pagination
    if (query.all === 'true' || query.all === true) {
      const fuelLogs = await fuelLogRepository.findAllWithoutPagination({
        startDate: query.startDate,
        endDate: query.endDate,
      });

      const totalCost = fuelLogs.reduce(
        (sum, log) => sum + Number(log.totalPrice),
        0,
      );

      return {
        dateRange: {
          from: query.startDate,
          to: query.endDate,
        },
        totalCost: Math.round(totalCost * 100) / 100,
        fuelLogs,
        total: fuelLogs.length,
      };
    }

    // Default pagination
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 20, 100);

    const result = await fuelLogRepository.findAll({
      startDate: query.startDate,
      endDate: query.endDate,
      page,
      limit,
    });

    const totalCost = result.fuelLogs.reduce(
      (sum, log) => sum + Number(log.totalPrice),
      0,
    );

    return {
      dateRange: {
        from: query.startDate,
        to: query.endDate,
      },
      totalCost: Math.round(totalCost * 100) / 100,
      fuelLogs: result.fuelLogs,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}

module.exports = new ReportService();
