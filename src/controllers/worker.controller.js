/**
 * Worker Controller
 * Handles HTTP requests for worker management endpoints
 */

const workerService = require('../services/worker.service');
const reportService = require('../services/report.service');
const { createWorkerSchema, updateWorkerSchema } = require('../validators/worker.validator');
const { sendSuccess } = require('../utils/response');
const ApiError = require('../utils/ApiError');

class WorkerController {
  /**
   * GET /api/workers
   * List all workers with optional filters and pagination
   */
  async listWorkers(req, res, next) {
    try {
      const result = await workerService.listWorkers(req.query);
      return sendSuccess(res, 200, 'Workers retrieved successfully', result.workers, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/workers/:id
   * Get a single worker by ID
   */
  async getWorkerById(req, res, next) {
    try {
      const worker = await workerService.getWorkerById(parseInt(req.params.id));
      return sendSuccess(res, 200, 'Worker retrieved successfully', worker);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/workers
   * Create a new worker account
   */
  async createWorker(req, res, next) {
    try {
      const data = createWorkerSchema.parse(req.body);
      const worker = await workerService.createWorker(data);
      return sendSuccess(res, 201, 'Worker created successfully', worker);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/workers/:id
   * Update worker information
   */
  async updateWorker(req, res, next) {
    try {
      const data = updateWorkerSchema.parse(req.body);
      const worker = await workerService.updateWorker(parseInt(req.params.id), data);
      return sendSuccess(res, 200, 'Worker updated successfully', worker);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/workers/:id
   * Remove a worker account
   */
  async deleteWorker(req, res, next) {
    try {
      await workerService.deleteWorker(parseInt(req.params.id));
      return sendSuccess(res, 200, 'Worker deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/workers/:id/history
   * Get fuel history for a specific worker
   * Workers can only view their own history, admins can view any worker's history
   */
  async getWorkerHistory(req, res, next) {
    try {
      const workerId = parseInt(req.params.id);
      
      // Check if the user is trying to access their own history or is an admin
      if (req.user.role !== 'ADMIN' && req.user.id !== workerId) {
        throw new ApiError('You can only view your own history', 403);
      }

      const result = await reportService.getWorkerReport(workerId, req.query);
      return sendSuccess(res, 200, 'Worker fuel history retrieved', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkerController();
