import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

const writeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

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
  if (origin && !env.corsOrigins.includes(origin)) {
    res.status(403).json({
      message: 'Forbidden: origin not allowed',
      requestId: req.headers['x-request-id']
    });
    return;
  }

  next();
};
