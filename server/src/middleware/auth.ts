import { Request, Response, NextFunction } from 'express';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '../utils/token.js';
import { HttpError } from '../utils/httpError.js';
import { prisma } from '../db/prisma.js';

export const auth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token) {
      throw new HttpError(401, 'Authentication required');
    }

    let payload;
    try {
      payload = verifyAuthToken(token);
    } catch {
      throw new HttpError(401, 'Invalid or expired session');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        emailVerified: true,
        tokenVersion: true
      }
    });

    if (!user) {
      throw new HttpError(401, 'User no longer exists');
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new HttpError(401, 'Session has been invalidated');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
