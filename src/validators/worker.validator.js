/**
 * Worker Validators — Zod Schemas
 */

const { z } = require('zod');

const roles = ['ADMIN', 'WORKER'];

const createWorkerSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters')
    .max(100)
    .trim(),
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters')
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z
    .enum(roles, {
      errorMap: () => ({ message: `Role must be one of: ${roles.join(', ')}` }),
    })
    .optional()
    .default('WORKER'),
  active: z.boolean().optional().default(true),
});

const updateWorkerSchema = z.object({
  fullName: z.string().min(2).max(100).trim().optional(),
  username: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim()
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .optional(),
  role: z
    .enum(roles, {
      errorMap: () => ({ message: `Role must be one of: ${roles.join(', ')}` }),
    })
    .optional(),
  active: z.boolean().optional(),
});

module.exports = { createWorkerSchema, updateWorkerSchema };
