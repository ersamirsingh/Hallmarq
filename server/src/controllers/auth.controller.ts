import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/auth.service.js';
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
