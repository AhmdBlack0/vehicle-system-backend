/**
 * Regenerate Barcodes Script
 * Updates all existing vehicles with new square format barcodes
 */

const { PrismaClient } = require('@prisma/client');
const { generateUniqueBarcode } = require('../src/utils/generateBarcode');

const prisma = new PrismaClient();

async function regenerateAllBarcodes() {
  console.log('🔄 Starting barcode regeneration...');
  
  try {
    // Get all vehicles
    const vehicles = await prisma.vehicle.findMany();
    console.log(`Found ${vehicles.length} vehicles to update`);
    
    let updatedCount = 0;
    
    for (const vehicle of vehicles) {
      // Generate new barcode
      const newBarcode = generateUniqueBarcode();
      
      // Update vehicle with new barcode
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { barcode: newBarcode }
      });
      
      console.log(`✅ Updated ${vehicle.vehicleNumber}: ${vehicle.barcode} → ${newBarcode}`);
      updatedCount++;
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} vehicles with new square barcodes`);
    console.log('─────────────────────────────────────────');
  } catch (error) {
    console.error('❌ Error regenerating barcodes:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

regenerateAllBarcodes();
