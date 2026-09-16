/**
 * Vehicle Service
 * Business logic for vehicle operations
 */

const vehicleRepository = require('../repositories/vehicle.repository');
const { generateBarcodeBuffer } = require('../utils/barcode.util');
const { generateUniqueBarcode } = require('../utils/generateBarcode');
const ApiError = require('../utils/ApiError');

class VehicleService {
  /**
   * List vehicles with search, filters, and pagination
   */
  async listVehicles(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100); // Cap at 100

    return vehicleRepository.findAll({
      search: query.search,
      status: query.status,
      department: query.department,
      page,
      limit,
    });
  }

  /**
   * Get a single vehicle by ID
   */
  async getVehicleById(id) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) {
      throw new ApiError(`Vehicle with ID ${id} not found`, 404);
    }
    return vehicle;
  }

  /**
   * Get a vehicle by barcode (used in worker scanning workflow)
   */
  async getVehicleByBarcode(barcode) {
    const vehicle = await vehicleRepository.findByBarcode(barcode);
    if (!vehicle) {
      throw new ApiError(`No vehicle found with barcode: ${barcode}`, 404);
    }
    return vehicle;
  }

  /**
   * Create a new vehicle with auto-generated unique barcode
   */
  async createVehicle(data) {
    // Auto-generate a unique barcode
    let barcode;
    let isUnique = false;

    // Retry loop to ensure uniqueness (collision safety)
    while (!isUnique) {
      barcode = generateUniqueBarcode();
      const existing = await vehicleRepository.findByBarcode(barcode);
      if (!existing) isUnique = true;
    }

    return vehicleRepository.create({ ...data, barcode });
  }

  /**
   * Update an existing vehicle
   */
  async updateVehicle(id, data) {
    // Ensure vehicle exists first
    await this.getVehicleById(id);
    return vehicleRepository.update(id, data);
  }

  /**
   * Delete a vehicle by ID
   */
  async deleteVehicle(id) {
    await this.getVehicleById(id);
    return vehicleRepository.delete(id);
  }

  /**
   * Generate and return a barcode PNG buffer for a vehicle
   * @param {number} id - Vehicle ID
   * @returns {Promise<{ buffer: Buffer, barcode: string, vehicle: Object }>}
   */
  async generateBarcodePng(id) {
    const vehicle = await this.getVehicleById(id);
    const buffer = await generateBarcodeBuffer(vehicle.barcode);
    return { buffer, barcode: vehicle.barcode, vehicle };
  }
}

module.exports = new VehicleService();
