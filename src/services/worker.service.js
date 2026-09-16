/**
 * Worker Service
 * Business logic for worker/user management
 */

const bcrypt = require('bcryptjs');
const workerRepository = require('../repositories/worker.repository');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 12;

class WorkerService {
  /**
   * List workers with filters and pagination
   */
  async listWorkers(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 100);

    // Parse active boolean from query string
    let active;
    if (query.active === 'true') active = true;
    else if (query.active === 'false') active = false;

    return workerRepository.findAll({
      search: query.search,
      role: query.role,
      active,
      page,
      limit,
    });
  }

  /**
   * Get a single worker by ID
   */
  async getWorkerById(id) {
    const worker = await workerRepository.findById(id);
    if (!worker) {
      throw new ApiError(`Worker with ID ${id} not found`, 404);
    }
    return worker;
  }

  /**
   * Create a new worker/admin user
   */
  async createWorker(data) {
    // Check username uniqueness
    const existing = await workerRepository.findByUsername(data.username);
    if (existing) {
      throw new ApiError(`Username '${data.username}' is already taken`, 409);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    return workerRepository.create({ ...data, password: hashedPassword });
  }

  /**
   * Update a worker by ID
   */
  async updateWorker(id, data) {
    // Ensure worker exists
    await this.getWorkerById(id);

    // If username is being changed, check uniqueness
    if (data.username) {
      const existing = await workerRepository.findByUsername(data.username);
      if (existing && existing.id !== id) {
        throw new ApiError(`Username '${data.username}' is already taken`, 409);
      }
    }

    // Hash new password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    return workerRepository.update(id, data);
  }

  /**
   * Delete a worker by ID
   */
  async deleteWorker(id) {
    await this.getWorkerById(id);
    return workerRepository.delete(id);
  }
}

module.exports = new WorkerService();
