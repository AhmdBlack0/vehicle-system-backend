/**
 * Worker Repository
 * Handles all direct Prisma database operations for users/workers
 */

const prisma = require('../config/database');

class WorkerRepository {
  /**
   * Find all workers with optional search and filters
   */
  async findAll({ search, role, active, page = 1, limit = 10 } = {}) {
    const where = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role;
    if (active !== undefined) where.active = active;

    const skip = (page - 1) * limit;

    const [workers, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          username: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          // Never return the password hash
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { workers, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Find a worker by ID (without password)
   */
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find a user by username (includes password for auth)
   */
  async findByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
  }

  /**
   * Create a new user
   */
  async create(data) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
  }

  /**
   * Update a user by ID
   */
  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        active: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Delete a user by ID
   */
  async delete(id) {
    return prisma.user.delete({ where: { id } });
  }

  /**
   * Count all users/workers
   */
  async count(where = {}) {
    return prisma.user.count({ where });
  }
}

module.exports = new WorkerRepository();
