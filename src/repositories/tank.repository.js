/**
 * Tank Repository
 * Handles all direct Prisma database operations for tank management
 */

const prisma = require('../config/database');

// Default relations to include in all tank queries
const defaultInclude = {
  transactions: {
    include: {
      user: true,
      vehicle: true,
    },
    orderBy: { createdAt: 'desc' },
  },
};

class TankRepository {
  /**
   * Get the single tank record (singleton pattern)
   */
  async getTank() {
    let tank = await prisma.tank.findFirst({
      include: defaultInclude,
    });

    // Create tank if it doesn't exist
    if (!tank) {
      tank = await prisma.tank.create({
        data: {
          currentBalance: 0,
          totalAdded: 0,
          totalWithdrawn: 0,
        },
        include: defaultInclude,
      });
    }

    return tank;
  }

  /**
   * Update tank balance and totals
   */
  async updateTank(id, data) {
    return prisma.tank.update({
      where: { id },
      data,
      include: defaultInclude,
    });
  }

  /**
   * Create a tank transaction
   */
  async createTransaction(data) {
    return prisma.tankTransaction.create({
      data,
      include: {
        user: true,
        vehicle: true,
      },
    });
  }

  /**
   * Get tank transactions with filters and pagination
   */
  async getTransactions({ type, userId, vehicleId, startDate, endDate, page = 1, limit = 10 } = {}) {
    const where = {};

    if (type) where.type = type;
    if (userId) where.userId = userId;
    if (vehicleId) where.vehicleId = vehicleId;

    // Date range filter on createdAt
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await prisma.$transaction([
      prisma.tankTransaction.findMany({
        where,
        include: {
          user: true,
          vehicle: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tankTransaction.count({ where }),
    ]);

    return { transactions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Get tank transactions for a specific user
   */
  async getUserTransactions(userId, { page = 1, limit = 10 } = {}) {
    return this.getTransactions({ userId, page, limit });
  }
}

module.exports = new TankRepository();
