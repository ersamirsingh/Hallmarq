import express from 'express';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
