/**
 * Fuel Log Validators — Zod Schemas
 */

const { z } = require('zod');

const createFuelLogSchema = z.object({
  vehicleId: z
    .number({ required_error: 'Vehicle ID is required' })
    .int('Vehicle ID must be an integer')
    .positive('Vehicle ID must be a positive number'),
  fuelPrice: z
    .number({ required_error: 'Fuel price is required' })
    .positive('Fuel price must be a positive number')
    .max(9999.99, 'Fuel price is too large'),
  fuelQuantity: z
    .number({ required_error: 'Fuel quantity is required' })
    .positive('Fuel quantity must be a positive number')
    .max(9999.99, 'Fuel quantity is too large'),
  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
  odometerBefore: z
    .string()
    .optional()
    .nullable(),
  odometerAfter: z
    .string()
    .optional()
    .nullable(),
  pumpBefore: z
    .string()
    .optional()
    .nullable(),
  pumpAfter: z
    .string()
    .optional()
    .nullable(),
  latitude: z
    .number()
    .optional()
    .nullable(),
  longitude: z
    .number()
    .optional()
    .nullable(),
});

module.exports = { createFuelLogSchema };
