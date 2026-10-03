import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'password',
      'newPassword',
      'currentPassword',
      'token',
      'authorization',
      'cookie',
      '*.password',
      '*.newPassword',
      '*.currentPassword',
      '*.token',
      '*.authorization',
      '*.cookie'
    ],
    censor: '[REDACTED]'
  }
});
