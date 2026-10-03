import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/;

export const passwordSchema = z
  .string()
  .min(8, 'Password must be between 8 and 16 characters')
  .max(16, 'Password must be between 8 and 16 characters')
  .regex(passwordRegex, 'Password must contain at least one uppercase letter and one special character');

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
  address: z.string().max(400, 'Address must not exceed 400 characters').optional().default('')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const resetPasswordSchema = z.object({
  password: passwordSchema
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema
});
