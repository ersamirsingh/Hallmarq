import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isProduction
    ? {
        base: undefined
      }
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss',
            singleLine: true
          }
        }
      }),
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
