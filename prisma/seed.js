/**
 * Database Seed — Vehicle Fuel Management System
 *
 * Seeds:
 *  - 1 Admin user
 *  - 2 Worker users
 *  - 3 Sample vehicles
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Starting database seed...');

  // ─── Hash Passwords ────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const workerPassword = await bcrypt.hash('Worker@123', 12);

  // ─── Upsert Admin ──────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      fullName: 'System Administrator',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      active: true,
    },
  });
  console.log(`✅  Admin created: ${admin.username}`);

  // ─── Upsert Workers ────────────────────────────────────────────────────────
  const worker1 = await prisma.user.upsert({
    where: { username: 'worker1' },
    update: {},
    create: {
      fullName: 'Ahmed Al-Rashidi',
      username: 'worker1',
      password: workerPassword,
      role: 'WORKER',
      active: true,
    },
  });
  console.log(`✅  Worker created: ${worker1.username}`);

  const worker2 = await prisma.user.upsert({
    where: { username: 'worker2' },
    update: {},
    create: {
      fullName: 'Mohammed Al-Harbi',
      username: 'worker2',
      password: workerPassword,
      role: 'WORKER',
      active: true,
    },
  });
  console.log(`✅  Worker created: ${worker2.username}`);

  // ─── Upsert Vehicles ───────────────────────────────────────────────────────
  const vehicles = [
    {
      barcode: 'VH-2024-001',
      vehicleNumber: 'VH-001',
      plateNumber: 'ABC-1234',
      vehicleType: 'Pickup Truck',
      department: 'Operations',
      status: 'ACTIVE',
    },
    {
      barcode: 'VH-2024-002',
      vehicleNumber: 'VH-002',
      plateNumber: 'XYZ-5678',
      vehicleType: 'Sedan',
      department: 'Management',
      status: 'ACTIVE',
    },
    {
      barcode: 'VH-2024-003',
      vehicleNumber: 'VH-003',
      plateNumber: 'DEF-9012',
      vehicleType: 'Van',
      department: 'Logistics',
      status: 'INACTIVE',
    },
  ];

  for (const vehicle of vehicles) {
    const v = await prisma.vehicle.upsert({
      where: { barcode: vehicle.barcode },
      update: {},
      create: vehicle,
    });
    console.log(`✅  Vehicle created: ${v.vehicleNumber} (${v.barcode})`);
  }

  // ─── Sample Fuel Log ───────────────────────────────────────────────────────
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { barcode: 'VH-2024-001' },
  });

  const existingLog = await prisma.fuelLog.findFirst({
    where: { vehicleId: existingVehicle.id, workerId: worker1.id },
  });

  if (!existingLog) {
    await prisma.fuelLog.create({
      data: {
        vehicleId: existingVehicle.id,
        workerId: worker1.id,
        fuelPrice: 2.5,
        fuelQuantity: 50,
        totalPrice: 125.0,
        notes: 'Initial sample fuel log',
      },
    });
    console.log('✅  Sample fuel log created');
  }

  console.log('\n🎉  Database seed completed successfully!');
  console.log('─────────────────────────────────────────');
  console.log('🔑  Admin credentials:  admin / Admin@123');
  console.log('🔑  Worker credentials: worker1 / Worker@123');
  console.log('─────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
