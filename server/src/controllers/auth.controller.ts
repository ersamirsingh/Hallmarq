import { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
} from '../services/auth.service.js';
import { setAuthCookie, clearAuthCookie } from '../utils/token.js';
import { env } from '../config/env.js';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, token } = await registerUser(req.body);
    setAuthCookie(res, token);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user, token } = await loginUser(req.body);
    setAuthCookie(res, token);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out successfully' });
};

export const getMe = (req: Request, res: Response): void => {
  res.json({
    user: req.user,
    emailVerificationRequired: env.REQUIRE_EMAIL_VERIFICATION
  });
};

export const handleVerifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await verifyEmail(req.body.token);
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

export const handleResendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await resendVerification(req.user!.id);
    res.json({ message: 'Verification email sent' });
  } catch (err) {
    next(err);
  }
};

export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await forgotPassword(req.body.email);
    res.json({ message: 'If that email has an account, a password reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

export const handleResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await resetPassword(req.body.token, req.body.newPassword);
    res.json({ message: 'Password has been reset successfully. Please sign in with your new password.' });
  } catch (err) {
    next(err);
  }
};
