/**
 * Fuel Log Repository
 * Handles all direct Prisma database operations for fuel logs
 */

const prisma = require('../config/database');

// Default relations to include in all fuel log queries
const defaultInclude = {
  vehicle: true,
  worker: true,
};

class FuelLogRepository {
  /**
   * Find all fuel logs with optional filters and pagination
   */
  async findAll({ vehicleId, workerId, startDate, endDate, page = 1, limit = 10 } = {}) {
    const where = {};

    if (vehicleId) where.vehicleId = vehicleId;
    if (workerId) where.workerId = workerId;

    // Date range filter on createdAt
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        // Include the full end day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const skip = (page - 1) * limit;

    const [fuelLogs, total] = await prisma.$transaction([
      prisma.fuelLog.findMany({
        where,
        include: defaultInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.fuelLog.count({ where }),
    ]);

    return { fuelLogs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Find a fuel log by ID with related data
   */
  async findById(id) {
    return prisma.fuelLog.findUnique({
      where: { id },
      include: defaultInclude,
    });
  }

  /**
   * Create a new fuel log entry
   */
  async create(data) {
    return prisma.fuelLog.create({
      data,
      include: defaultInclude,
    });
  }

  /**
   * Aggregate total fuel cost for a given date range (for dashboard/reports)
   */
  async sumTotalPrice(where = {}) {
    const result = await prisma.fuelLog.aggregate({
      where,
      _sum: { totalPrice: true },
      _count: { id: true },
    });
    return {
      totalCost: result._sum.totalPrice || 0,
      count: result._count.id,
    };
  }

  /**
   * Get fuel logs grouped by day for daily reports
   */
  async getDailyReport(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.fuelLog.findMany({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
      include: defaultInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get fuel logs for a specific month/year
   */
  async getMonthlyReport(year, month) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const [logs, aggregate] = await prisma.$transaction([
      prisma.fuelLog.findMany({
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        include: defaultInclude,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.fuelLog.aggregate({
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { totalPrice: true, fuelQuantity: true },
        _count: { id: true },
      }),
    ]);

    return {
      logs,
      summary: {
        totalCost: aggregate._sum.totalPrice || 0,
        totalQuantity: aggregate._sum.fuelQuantity || 0,
        totalOperations: aggregate._count.id,
      },
    };
  }

  /**
   * Find all fuel logs without pagination (for reports)
   */
  async findAllWithoutPagination({ vehicleId, workerId, startDate, endDate } = {}) {
    const where = {};

    if (vehicleId) where.vehicleId = vehicleId;
    if (workerId) where.workerId = workerId;

    // Date range filter on createdAt
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        // Include the full end day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const fuelLogs = await prisma.fuelLog.findMany({
      where,
      include: defaultInclude,
      orderBy: { createdAt: 'desc' },
    });

    return fuelLogs;
  }
}

module.exports = new FuelLogRepository();
