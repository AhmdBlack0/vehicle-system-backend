/**
 * Prisma Client Singleton
 * Prevents multiple instances during development (hot-reload)
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

// Reuse the existing Prisma instance in development
const globalForPrisma = global;

// Use a version key to force recreation when schema changes
const PRISMA_VERSION = '2'; // Increment this to force Prisma Client recreation

const prisma =
  (globalForPrisma.prisma && globalForPrisma.prismaVersion === PRISMA_VERSION)
    ? globalForPrisma.prisma
    : new PrismaClient({
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ],
      });

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
  });
}

prisma.$on('error', (e) => {
  logger.error(`Prisma error: ${e.message}`);
});

prisma.$on('warn', (e) => {
  logger.warn(`Prisma warning: ${e.message}`);
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaVersion = PRISMA_VERSION;
}

module.exports = prisma;
