/**
 * Prisma Client Singleton
 * Prevents multiple instances during development (hot-reload)
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

// Reuse the existing Prisma instance in development
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
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
}

module.exports = prisma;
