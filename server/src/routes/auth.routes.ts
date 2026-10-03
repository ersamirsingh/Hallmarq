import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  handleVerifyEmail,
  handleResendVerification,
  handleForgotPassword,
  handleResetPassword
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../schemas/auth.schema.js';
import { auth } from '../middleware/auth.js';
import {
  registerLimiter,
  loginLimiter,
  authEmailIpLimiter,
  authEmailAccountLimiter
} from '../middleware/rateLimiters.js';

export const authRouter = Router();

authRouter.post('/register', registerLimiter, validate(registerSchema), register);
authRouter.post('/login', loginLimiter, validate(loginSchema), login);
authRouter.post('/logout', auth, logout);
authRouter.get('/me', auth, getMe);

authRouter.post(
  '/verify-email',
  validate(verifyEmailSchema),
  handleVerifyEmail
);

authRouter.post(
  '/resend-verification',
  auth,
  authEmailIpLimiter,
  authEmailAccountLimiter,
  handleResendVerification
);

authRouter.post(
  '/forgot-password',
  authEmailIpLimiter,
  authEmailAccountLimiter,
  validate(forgotPasswordSchema),
  handleForgotPassword
);

authRouter.post(
  '/reset-password',
  authEmailIpLimiter,
  authEmailAccountLimiter,
  validate(resetPasswordSchema),
  handleResetPassword
);
