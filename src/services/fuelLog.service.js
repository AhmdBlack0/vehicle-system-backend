/**
 * Fuel Log Service
 * Business logic for fuel logging operations
 */

const fuelLogRepository = require('../repositories/fuelLog.repository');
const vehicleRepository = require('../repositories/vehicle.repository');
const ApiError = require('../utils/ApiError');

class FuelLogService {
  /**
   * List all fuel logs with filters and pagination
   */
  async listFuelLogs(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100);

    return fuelLogRepository.findAll({
      vehicleId: query.vehicleId ? parseInt(query.vehicleId) : undefined,
      workerId: query.workerId ? parseInt(query.workerId) : undefined,
      startDate: query.startDate,
      endDate: query.endDate,
      page,
      limit,
    });
  }

  /**
   * Get a single fuel log by ID
   */
  async getFuelLogById(id) {
    const log = await fuelLogRepository.findById(id);
    if (!log) {
      throw new ApiError(`Fuel log with ID ${id} not found`, 404);
    }
    return log;
  }

  /**
   * Create a new fuel log entry
   * Workflow:
   *  1. Validate vehicle exists and is ACTIVE
   *  2. Calculate totalPrice = fuelPrice × fuelQuantity
   *  3. Persist to database
   *
   * @param {Object} data - { vehicleId, fuelPrice, fuelQuantity, notes, odometerBefore, odometerAfter, pumpBefore, pumpAfter, latitude, longitude }
   * @param {number} workerId - ID of the authenticated worker
   */
  async createFuelLog(data, workerId) {
    const { vehicleId, fuelPrice, fuelQuantity, notes, odometerBefore, odometerAfter, pumpBefore, pumpAfter, latitude, longitude } = data;

    // 1. Validate vehicle exists
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(`Vehicle with ID ${vehicleId} not found`, 404);
    }

    // 2. Ensure vehicle is active (cannot fuel an inactive vehicle)
    if (vehicle.status !== 'ACTIVE') {
      throw new ApiError(
        `Cannot log fuel for vehicle ${vehicle.vehicleNumber} — status is ${vehicle.status}`,
        400,
      );
    }

    // 3. Calculate total price (rounded to 2 decimal places)
    const totalPrice = Math.round(fuelPrice * fuelQuantity * 100) / 100;

    // 4. Create fuel log (including GPS location if provided)
    return fuelLogRepository.create({
      vehicleId,
      workerId,
      fuelPrice,
      fuelQuantity,
      totalPrice,
      notes: notes || null,
      odometerBefore: odometerBefore || null,
      odometerAfter: odometerAfter || null,
      pumpBefore: pumpBefore || null,
      pumpAfter: pumpAfter || null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    });
  }
}

module.exports = new FuelLogService();
