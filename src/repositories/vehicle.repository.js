/**
 * Vehicle Repository
 * Handles all direct Prisma database operations for vehicles
 */

const prisma = require('../config/database');

class VehicleRepository {
  /**
   * Find all vehicles with optional search and filters
   * @param {Object} options
   * @param {string} [options.search] - Search by vehicleNumber, plateNumber, department, vehicleType
   * @param {string} [options.status] - Filter by status (ACTIVE | INACTIVE)
   * @param {string} [options.department] - Filter by department
   * @param {number} [options.page] - Page number (default: 1)
   * @param {number} [options.limit] - Items per page (default: 10)
   */
  async findAll({ search, status, department, page = 1, limit = 10 } = {}) {
    const where = {};

    // Full-text search across multiple fields
    if (search) {
      where.OR = [
        { vehicleNumber: { contains: search, mode: 'insensitive' } },
        { plateNumber: { contains: search, mode: 'insensitive' } },
        { vehicleType: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (department) where.department = { contains: department, mode: 'insensitive' };

    const skip = (page - 1) * limit;

    const [vehicles, total] = await prisma.$transaction([
      prisma.vehicle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    return { vehicles, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Find a vehicle by its primary key
   */
  async findById(id) {
    return prisma.vehicle.findUnique({ where: { id } });
  }

  /**
   * Find a vehicle by its barcode string
   */
  async findByBarcode(barcode) {
    return prisma.vehicle.findUnique({ where: { barcode } });
  }

  /**
   * Create a new vehicle record
   */
  async create(data) {
    return prisma.vehicle.create({ data });
  }

  /**
   * Update a vehicle record by ID
   */
  async update(id, data) {
    return prisma.vehicle.update({ where: { id }, data });
  }

  /**
   * Delete a vehicle record by ID
   */
  async delete(id) {
    return prisma.vehicle.delete({ where: { id } });
  }

  /**
   * Count all vehicles
   */
  async count(where = {}) {
    return prisma.vehicle.count({ where });
  }
}

module.exports = new VehicleRepository();
