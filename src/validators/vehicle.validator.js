/**
 * Vehicle Validators — Zod Schemas
 */

const { z } = require('zod');

const vehicleStatuses = ['ACTIVE', 'INACTIVE'];

const createVehicleSchema = z.object({
  vehicleNumber: z
    .string({ required_error: 'Vehicle number is required' })
    .min(1, 'Vehicle number is required')
    .max(50)
    .trim(),
  plateNumber: z
    .string({ required_error: 'Plate number is required' })
    .min(1, 'Plate number is required')
    .max(50)
    .trim(),
  vehicleType: z
    .string({ required_error: 'Vehicle type is required' })
    .min(1, 'Vehicle type is required')
    .max(100)
    .trim(),
  department: z
    .string({ required_error: 'Department is required' })
    .min(1, 'Department is required')
    .max(100)
    .trim(),
  status: z
    .enum(vehicleStatuses, {
      errorMap: () => ({ message: `Status must be one of: ${vehicleStatuses.join(', ')}` }),
    })
    .optional()
    .default('ACTIVE'),
});

const updateVehicleSchema = z.object({
  vehicleNumber: z.string().min(1).max(50).trim().optional(),
  plateNumber: z.string().min(1).max(50).trim().optional(),
  vehicleType: z.string().min(1).max(100).trim().optional(),
  department: z.string().min(1).max(100).trim().optional(),
  status: z
    .enum(vehicleStatuses, {
      errorMap: () => ({ message: `Status must be one of: ${vehicleStatuses.join(', ')}` }),
    })
    .optional(),
});

module.exports = { createVehicleSchema, updateVehicleSchema };
