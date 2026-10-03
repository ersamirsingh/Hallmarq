import { z } from 'zod';

export const cleanComment = (val: string): string => {
  return val.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '').trim();
};

export const submitRatingSchema = z.object({
  body: z
    .object({
      value: z
        .number({ required_error: 'Rating value is required' })
        .int('Rating value must be an integer')
        .min(1, 'Rating must be between 1 and 5')
        .max(5, 'Rating must be between 1 and 5'),
      comment: z
        .string()
        .max(500, 'Comment cannot exceed 500 characters')
        .transform((val) => cleanComment(val))
        .nullable()
        .optional()
    })
    .strict()
});
