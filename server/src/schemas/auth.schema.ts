import { z } from 'zod';

export const nameSchema = z
  .string({ required_error: 'Name is required' })
  .trim()
  .min(3, 'Name must be between 3 and 60 characters')
  .max(60, 'Name must be between 3 and 60 characters');

export const addressSchema = z
  .string({ required_error: 'Address is required' })
  .trim()
  .min(1, 'Address is required')
  .max(400, 'Address cannot exceed 400 characters');

export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .email('Invalid email address');

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be between 8 and 16 characters')
  .max(16, 'Password must be between 8 and 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  body: z
    .object({
      name: nameSchema,
      email: emailSchema,
      address: addressSchema,
      password: passwordSchema
    })
    .strict()
});

export const loginSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required')
    })
    .strict()
});

export const forgotPasswordSchema = z.object({
  body: z
    .object({
      email: emailSchema
    })
    .strict()
});

export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string({ required_error: 'Token is required' }).min(1, 'Token is required'),
      newPassword: passwordSchema
    })
    .strict()
});

export const verifyEmailSchema = z.object({
  body: z
    .object({
      token: z.string({ required_error: 'Token is required' }).min(1, 'Token is required')
    })
    .strict()
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string({ required_error: 'Current password is required' }).min(1, 'Current password is required'),
      newPassword: passwordSchema
    })
    .strict()
});

export const updateProfileSchema = z.object({
  body: z
    .object({
      name: nameSchema,
      email: emailSchema,
      address: addressSchema
    })
    .strict()
});
