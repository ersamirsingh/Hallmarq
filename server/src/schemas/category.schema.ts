import { z } from 'zod';

export const categoryNameSchema = z
  .string({ required_error: 'Category name is required' })
  .trim()
  .min(2, 'Category name must be between 2 and 50 characters')
  .max(50, 'Category name must be between 2 and 50 characters');

export const createCategorySchema = z.object({
  body: z
    .object({
      name: categoryNameSchema
    })
    .strict()
});
