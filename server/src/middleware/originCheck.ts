import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

const writeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const isAllowedOrigin = (origin: string, allowedOrigins: string[]): boolean => {
  const normalized = origin.replace(/\/+$/, '');
  return allowedOrigins.some((allowed) => {
    const cleanAllowed = allowed.replace(/\/+$/, '');
    if (cleanAllowed === '*' || cleanAllowed === normalized) return true;
    if (cleanAllowed.includes('*')) {
      const pattern = cleanAllowed.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(normalized);
    }
    return false;
  });
};

export const originCheck = (req: Request, res: Response, next: NextFunction): void => {
  if (!writeMethods.has(req.method)) {
    next();
    return;
  }

  const requestedWith = req.headers['x-requested-with'];
  if (!requestedWith || (typeof requestedWith === 'string' && requestedWith.toLowerCase() !== 'xmlhttprequest')) {
    res.status(403).json({
      message: 'Forbidden: missing or invalid X-Requested-With header',
      requestId: req.headers['x-request-id']
    });
    return;
  }

  const origin = req.headers.origin;
  if (origin && !isAllowedOrigin(origin, env.corsOrigins)) {
    res.status(403).json({
      message: 'Forbidden: origin not allowed',
      requestId: req.headers['x-request-id']
    });
    return;
  }

  next();
};
