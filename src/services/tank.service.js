/**
 * Tank Service
 * Business logic for tank management operations
 */

const tankRepository = require('../repositories/tank.repository');
const ApiError = require('../utils/ApiError');

class TankService {
  /**
   * Get tank information with current balance and summary
   */
  async getTankInfo() {
    const tank = await tankRepository.getTank();
    return tank;
  }

  /**
   * Add fuel to the tank
   * Workflow:
   *  1. Get current tank
   *  2. Validate quantity is positive
   *  3. Calculate new balance
   *  4. Create ADD transaction
   *  5. Update tank totals
   *
   * @param {Object} data - { quantity, notes }
   * @param {number} userId - ID of the authenticated user
   */
  async addFuelToTank(data, userId) {
    const { quantity, notes, tankBeforeImage, tankAfterImage } = data;

    // 1. Get current tank
    const tank = await tankRepository.getTank();

    // 2. Validate quantity
    if (quantity <= 0) {
      throw new ApiError('Quantity must be greater than zero', 400);
    }

    // 3. Calculate new balance (convert Decimal to Number for calculation)
    const balanceBefore = parseFloat(tank.currentBalance);
    const balanceAfter = balanceBefore + parseFloat(quantity);
    const newTotalAdded = parseFloat(tank.totalAdded) + parseFloat(quantity);

    // 4. Create ADD transaction
    await tankRepository.createTransaction({
      tankId: tank.id,
      type: 'ADD',
      quantity: parseFloat(quantity),
      balanceBefore,
      balanceAfter,
      userId,
      notes: notes || null,
      tankBeforeImage: tankBeforeImage || null,
      tankAfterImage: tankAfterImage || null,
    });

    // 5. Update tank totals
    return tankRepository.updateTank(tank.id, {
      currentBalance: balanceAfter,
      totalAdded: newTotalAdded,
    });
  }

  /**
   * Withdraw fuel from the tank (internal method, called when fueling a vehicle)
   * Workflow:
   *  1. Get current tank
   *  2. Validate sufficient balance
   *  3. Calculate new balance
   *  4. Create WITHDRAW transaction
   *  5. Update tank totals
   *
   * @param {number} quantity - Amount to withdraw
   * @param {number} userId - ID of the user performing the withdrawal
   * @param {number} vehicleId - ID of the vehicle being fueled
   */
  async withdrawFuelFromTank(quantity, userId, vehicleId) {
    // 1. Get current tank
    const tank = await tankRepository.getTank();

    // 2. Validate sufficient balance
    if (quantity <= 0) {
      throw new ApiError('Quantity must be greater than zero', 400);
    }

    const currentBalance = parseFloat(tank.currentBalance);
    if (currentBalance < parseFloat(quantity)) {
      throw new ApiError(
        `الكمية المطلوبة أكبر من كمية الوقود المتاحة في التنك. المتاح: ${currentBalance} لتر`,
        400,
      );
    }

    // 3. Calculate new balance (convert Decimal to Number for calculation)
    const balanceBefore = currentBalance;
    const balanceAfter = balanceBefore - parseFloat(quantity);
    const newTotalWithdrawn = parseFloat(tank.totalWithdrawn) + parseFloat(quantity);

    // 4. Create WITHDRAW transaction
    await tankRepository.createTransaction({
      tankId: tank.id,
      type: 'WITHDRAW',
      quantity: parseFloat(quantity),
      balanceBefore,
      balanceAfter,
      userId,
      vehicleId,
      notes: null,
    });

    // 5. Update tank totals
    return tankRepository.updateTank(tank.id, {
      currentBalance: balanceAfter,
      totalWithdrawn: newTotalWithdrawn,
    });
  }

  /**
   * Get tank transactions with filters and pagination
   */
  async getTransactions(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100);

    return tankRepository.getTransactions({
      type: query.type,
      userId: query.userId ? parseInt(query.userId) : undefined,
      vehicleId: query.vehicleId ? parseInt(query.vehicleId) : undefined,
      startDate: query.startDate,
      endDate: query.endDate,
      page,
      limit,
    });
  }

  /**
   * Get tank transactions for a specific user
   */
  async getUserTransactions(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100);

    return tankRepository.getUserTransactions(userId, { page, limit });
  }
}

module.exports = new TankService();
