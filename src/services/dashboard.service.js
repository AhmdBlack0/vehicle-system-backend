/**
 * Dashboard Service
 * Aggregates key metrics for the admin dashboard
 */

const prisma = require('../config/database');

class DashboardService {
  /**
   * Get all dashboard summary statistics
   * @returns {Promise<Object>} Dashboard metrics
   */
  async getSummary() {
    const now = new Date();

    // Today's date range
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Current month date range
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Run all queries in parallel for performance
    const [
      totalVehicles,
      activeVehicles,
      totalWorkers,
      activeWorkers,
      todayAgg,
      monthlyAgg,
    ] = await Promise.all([
      // Total vehicles
      prisma.vehicle.count(),

      // Active vehicles only
      prisma.vehicle.count({ where: { status: 'ACTIVE' } }),

      // Total workers only (exclude admins)
      prisma.user.count({ where: { role: 'WORKER' } }),

      // Active workers only
      prisma.user.count({ where: { role: 'WORKER', active: true } }),

      // Today's fuel operations aggregate
      prisma.fuelLog.aggregate({
        where: { createdAt: { gte: startOfToday, lte: endOfToday } },
        _sum: { totalPrice: true, fuelQuantity: true },
        _count: { id: true },
      }),

      // Monthly fuel operations aggregate
      prisma.fuelLog.aggregate({
        where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { totalPrice: true, fuelQuantity: true },
        _count: { id: true },
      }),
    ]);

    return {
      vehicles: {
        total: totalVehicles,
        active: activeVehicles,
        inactive: totalVehicles - activeVehicles,
      },
      workers: {
        total: totalWorkers,
        activeWorkers,
      },
      today: {
        operations: todayAgg._count.id,
        totalCost: Number(todayAgg._sum.totalPrice) || 0,
        totalQuantity: Number(todayAgg._sum.fuelQuantity) || 0,
        date: now.toISOString().split('T')[0],
      },
      monthly: {
        operations: monthlyAgg._count.id,
        totalCost: Number(monthlyAgg._sum.totalPrice) || 0,
        totalQuantity: Number(monthlyAgg._sum.fuelQuantity) || 0,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    };
  }
}

module.exports = new DashboardService();
