/**
 * Tank Validators — Zod Schemas
 */

const { z } = require('zod');

const addFuelToTankSchema = z.object({
  quantity: z
    .number({ required_error: 'Quantity is required' })
    .positive('Quantity must be a positive number')
    .max(999999.99, 'Quantity is too large'),
  notes: z
    .string()
    .max(500, 'Notes must not exceed 500 characters')
    .trim()
    .optional()
    .nullable(),
  tankBeforeImage: z
    .string()
    .optional()
    .nullable(),
  tankAfterImage: z
    .string()
    .optional()
    .nullable(),
});

module.exports = { addFuelToTankSchema };
