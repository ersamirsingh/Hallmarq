import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { HttpError } from '../utils/httpError.js';

export const requireRole = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new HttpError(401, 'Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new HttpError(403, 'Forbidden: insufficient permissions'));
      return;
    }

    next();
  };
};
