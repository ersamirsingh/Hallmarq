import { z } from 'zod';
import { emailSchema, addressSchema } from './auth.schema.js';

export const storeNameSchema = z
  .string({ required_error: 'Store name is required' })
  .trim()
  .min(3, 'Store name must be between 3 and 100 characters')
  .max(100, 'Store name must be between 3 and 100 characters');

export const createStoreSchema = z.object({
  body: z
    .object({
      name: storeNameSchema,
      email: emailSchema,
      address: addressSchema,
      categoryId: z.coerce.number({ required_error: 'Category is required' }).int().positive(),
      ownerId: z.coerce.number().int().positive().optional().nullable()
    })
    .strict()
});

export const updateStoreNameSchema = z.object({
  body: z
    .object({
      name: storeNameSchema
    })
    .strict()
});
