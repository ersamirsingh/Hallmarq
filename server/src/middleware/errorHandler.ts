import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/httpError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const requestId = req.headers['x-request-id'] || res.getHeader('X-Request-Id');

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of err.issues) {
      const field = issue.path.join('.') || 'body';
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    }
    res.status(400).json({
      message: 'Validation failed',
      errors,
      requestId
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
      requestId
    });
    return;
  }

  if (err?.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    res.status(409).json({
      message: `A record with this ${target} already exists`,
      requestId
    });
    return;
  }

  if (err.type === 'entity.too.large') {
    res.status(413).json({
      message: 'Request entity too large',
      requestId
    });
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      message: 'Invalid JSON payload',
      requestId
    });
    return;
  }

  logger.error({ err, requestId, url: req.originalUrl, method: req.method }, 'Unhandled server error');

  res.status(500).json({
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Internal server error',
    requestId
  });
};
