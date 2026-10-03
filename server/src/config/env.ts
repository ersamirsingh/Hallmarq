import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_URL_TEST: z.string().min(1, 'DATABASE_URL_TEST is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  CLIENT_URL: z.string().min(1, 'CLIENT_URL is required'),
  TRUST_PROXY: z.coerce.number().int().nonnegative().default(0),
  BCRYPT_COST: z.coerce.number().int().min(4).max(16).default(12),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().positive().default(1025),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  MAIL_FROM: z.string().default('Hallmarq <no-reply@rateit.com>'),
  REQUIRE_EMAIL_VERIFICATION: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),
  ENABLE_DOCS: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return process.env.NODE_ENV !== 'production';
    }),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  process.stderr.write('Invalid environment variables:\n');
  for (const issue of parsed.error.issues) {
    process.stderr.write(`  ${issue.path.join('.')}: ${issue.message}\n`);
  }
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
};

export type Env = typeof env;
