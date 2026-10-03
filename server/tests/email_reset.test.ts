import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetTestDb } from './helpers/db.js';
import { createTestUser } from './helpers/auth.js';
import { prisma } from '../src/db/prisma.js';
import { generateSecureToken } from '../src/utils/token.js';
import { TokenType } from '@prisma/client';

describe('Email verification and password reset flows', () => {
  const app = createApp();

  beforeAll(async () => {
    await resetTestDb();
  });

  it('email verification token works once and second attempt fails', async () => {
    const { user } = await createTestUser('USER', { emailVerified: false });
    const { rawToken, tokenHash } = generateSecureToken();

    await prisma.authToken.create({
      data: {
        userId: user.id,
        type: TokenType.EMAIL_VERIFY,
        tokenHash,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    const res1 = await request(app)
      .post('/api/auth/verify-email')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ token: rawToken });

    expect(res1.status).toBe(200);

    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(updatedUser?.emailVerified).toBe(true);

    const res2 = await request(app)
      .post('/api/auth/verify-email')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ token: rawToken });

    expect(res2.status).toBe(400);
  });

  it('rejects an expired verification token', async () => {
    const { user } = await createTestUser('USER', { emailVerified: false });
    const { rawToken, tokenHash } = generateSecureToken();

    await prisma.authToken.create({
      data: {
        userId: user.id,
        type: TokenType.EMAIL_VERIFY,
        tokenHash,
        expiresAt: new Date(Date.now() - 1000)
      }
    });

    const res = await request(app)
      .post('/api/auth/verify-email')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ token: rawToken });

    expect(res.status).toBe(400);
  });

  it('returns identical response on forgot-password for existing and non-existing accounts', async () => {
    const { user } = await createTestUser();

    const resKnown = await request(app)
      .post('/api/auth/forgot-password')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: user.email });

    const resUnknown = await request(app)
      .post('/api/auth/forgot-password')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: 'ghost_nonexistent@rateit.com' });

    expect(resKnown.status).toBe(200);
    expect(resUnknown.status).toBe(200);
    expect(resKnown.body.message).toBe(resUnknown.body.message);
  });

  it('reset password token works once and second attempt fails', async () => {
    const { user } = await createTestUser();
    const { rawToken, tokenHash } = generateSecureToken();

    await prisma.authToken.create({
      data: {
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000)
      }
    });

    const res1 = await request(app)
      .post('/api/auth/reset-password')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ token: rawToken, newPassword: 'FreshResetPw@123' });

    expect(res1.status).toBe(200);

    const res2 = await request(app)
      .post('/api/auth/reset-password')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ token: rawToken, newPassword: 'FreshResetPw@123' });

    expect(res2.status).toBe(400);
  });
});
