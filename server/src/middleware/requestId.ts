import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const reqId = (req.headers['x-request-id'] as string) || randomUUID();
  req.headers['x-request-id'] = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
};
