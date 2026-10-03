import { Request, Response, NextFunction } from 'express';

const methodsWithBody = new Set(['POST', 'PUT', 'PATCH']);

export const contentTypeCheck = (req: Request, res: Response, next: NextFunction): void => {
  if (!methodsWithBody.has(req.method)) {
    next();
    return;
  }

  const contentType = req.headers['content-type'];
  const contentLength = req.headers['content-length'];
  const hasBody = contentLength !== undefined && contentLength !== '0';

  if (contentType && !contentType.toLowerCase().includes('application/json')) {
    res.status(415).json({
      message: 'Unsupported Media Type: Content-Type must be application/json',
      requestId: req.headers['x-request-id']
    });
    return;
  }

  if (hasBody && !contentType) {
    res.status(400).json({
      message: 'Bad Request: Content-Type header is required for request body',
      requestId: req.headers['x-request-id']
    });
    return;
  }

  next();
};
