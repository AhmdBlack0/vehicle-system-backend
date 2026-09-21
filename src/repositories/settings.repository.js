const { PrismaClient } = require('@prisma/client');

class SettingsRepository {
  async getSettings() {
    const prisma = new PrismaClient();
    try {
      return await prisma.settings.findUnique({
        where: { id: 1 }
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateSettings(fuelPrice) {
    const prisma = new PrismaClient();
    try {
      return await prisma.settings.upsert({
        where: { id: 1 },
        update: { fuelPrice },
        create: { id: 1, fuelPrice }
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new SettingsRepository();
