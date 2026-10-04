import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma } from './db/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server listening on port ${env.PORT} (${env.NODE_ENV})`);
});

const handleShutdown = (signal: string) => {
  logger.info(`Shutdown signal ${signal} received`);
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
