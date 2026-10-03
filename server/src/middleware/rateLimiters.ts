import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const buildRateLimitHandler = (message: string) => {
  return (req: Request, res: Response, _next: unknown, options: { statusCode: number }): void => {
    res.status(options.statusCode).json({
      message,
      requestId: req.headers['x-request-id']
    });
  };
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: buildRateLimitHandler('Too many requests from this IP, please try again after 15 minutes')
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const email = typeof req.body?.email === 'string' ? req.body.email.toLowerCase().trim() : '';
    return `${req.ip}_${email}`;
  },
  handler: buildRateLimitHandler('Too many failed login attempts, please try again after 15 minutes')
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  skipFailedRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: buildRateLimitHandler('Too many accounts created from this IP, please try again after an hour')
});

export const authEmailIpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: buildRateLimitHandler('Too many attempts from this IP, please try again after an hour')
});

export const authEmailAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req: Request): boolean => {
    const hasBodyEmail = typeof req.body?.email === 'string' && req.body.email.trim().length > 0;
    const hasUserEmail = typeof (req as Request & { user?: { email?: string } }).user?.email === 'string';
    return !hasBodyEmail && !hasUserEmail;
  },
  keyGenerator: (req: Request): string => {
    const emailFromBody = typeof req.body?.email === 'string' ? req.body.email.toLowerCase().trim() : '';
    const emailFromUser = (req as Request & { user?: { email: string } }).user?.email;
    return emailFromBody || emailFromUser || 'unknown';
  },
  handler: buildRateLimitHandler('Too many attempts for this email, please try again after an hour')
});

export const userWritesLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const userId = (req as Request & { user?: { id: number } }).user?.id;
    return userId ? `user_${userId}` : req.ip || 'unknown';
  },
  handler: buildRateLimitHandler('Too many write operations, please try again in a minute')
});

export const adminCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const userId = (req as Request & { user?: { id: number } }).user?.id;
    return userId ? `admin_${userId}` : req.ip || 'unknown';
  },
  handler: buildRateLimitHandler('Too many admin creation requests, please try again in a minute')
});
