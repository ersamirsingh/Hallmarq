import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestId } from './middleware/requestId.js';
import { originCheck, isAllowedOrigin } from './middleware/originCheck.js';
import { contentTypeCheck } from './middleware/contentTypeCheck.js';
import { globalLimiter } from './middleware/rateLimiters.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { HttpError } from './utils/httpError.js';
import { prisma } from './db/prisma.js';
import { authRouter } from './routes/auth.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { categoryRouter } from './routes/category.routes.js';
import { storeRouter } from './routes/store.routes.js';
import { ownerRouter } from './routes/owner.routes.js';
import { profileRouter } from './routes/profile.routes.js';
import { requestLogger } from './middleware/requestLogger.js';

export const createApp = (): Express => {
  const app = express();

  app.set('trust proxy', env.TRUST_PROXY);

  app.use(requestId);
  app.use(requestLogger);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", ...env.corsOrigins],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: env.NODE_ENV === 'production' ? [] : null
        }
      },
      hsts:
        env.NODE_ENV === 'production'
          ? {
              maxAge: 31536000,
              includeSubDomains: true,
              preload: true
            }
          : false
    })
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin, env.corsOrigins)) {
          callback(null, true);
        } else {
          callback(new HttpError(403, 'Forbidden: origin not allowed'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id']
    })
  );

  app.use(globalLimiter);
  app.use(contentTypeCheck);
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());
  app.use(originCheck);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/ready', async (_req, res, next) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok' });
    } catch (err) {
      next(err);
    }
  });

  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/categories', categoryRouter);
  app.use('/api/stores', storeRouter);
  app.use('/api/owner', ownerRouter);
  app.use('/api/profile', profileRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
