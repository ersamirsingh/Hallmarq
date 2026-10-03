import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetTestDb } from './helpers/db.js';

describe('Auth lifecycle and security', () => {
  const app = createApp();
  const testUser = {
    name: 'Authentication Lifecycle Test User',
    email: 'auth_lifecycle@rateit.com',
    address: '500 Security Parkway',
    password: 'Password@123'
  };

  beforeAll(async () => {
    await resetTestDb();
  });

  it('registers a new user and sets httpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.user?.email).toBe(testUser.email);
    expect(res.body.user?.role).toBe('USER');

    const cookie = res.headers['set-cookie']?.[0];
    expect(cookie).toBeDefined();
    expect(cookie).toContain('token=');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
  });

  it('logs in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.user?.email).toBe(testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('returns current user session on /api/auth/me', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: testUser.email, password: testUser.password });

    const cookie = loginRes.headers['set-cookie'];

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookie);

    expect(res.status).toBe(200);
    expect(res.body.user?.email).toBe(testUser.email);
    expect(res.body.emailVerificationRequired).toBeDefined();
  });

  it('logs out and clears the cookie', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: testUser.email, password: testUser.password });

    const cookie = loginRes.headers['set-cookie'];

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', cookie);

    expect(logoutRes.status).toBe(200);

    const meRes = await request(app).get('/api/auth/me');
    expect(meRes.status).toBe(401);
  });

  it('gives identical message for wrong password and unknown email', async () => {
    const wrongPwRes = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: testUser.email, password: 'WrongPassword@123' });

    const unknownEmailRes = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: 'unknown_account@rateit.com', password: 'WrongPassword@123' });

    expect(wrongPwRes.status).toBe(401);
    expect(unknownEmailRes.status).toBe(401);
    expect(wrongPwRes.body.message).toBe('Email or password is incorrect.');
    expect(unknownEmailRes.body.message).toBe('Email or password is incorrect.');
  });

  it('locks account after 5 failed login attempts and returns 403 on 6th attempt', async () => {
    for (let i = 2; i <= 5; i++) {
      const res = await request(app)
        .post('/api/auth/login')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({ email: testUser.email, password: 'WrongPassword@123' });
      expect(res.status).toBe(401);
    }

    const lockedRes = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: testUser.email, password: testUser.password });

    expect(lockedRes.status).toBe(403);
    expect(lockedRes.body.message).toContain('Account is temporarily locked');
  });

  it('invalidates old sessions after a password change', async () => {
    const { prisma } = await import('../src/db/prisma.js');
    await prisma.user.update({
      where: { email: testUser.email },
      data: { lockedUntil: null, failedLoginCount: 0 }
    });

    const loginRes1 = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: testUser.email, password: testUser.password });
    const oldCookieDevice = loginRes1.headers['set-cookie'];

    const loginRes2 = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: testUser.email, password: testUser.password });
    const activeCookieDevice = loginRes2.headers['set-cookie'];

    const changeRes = await request(app)
      .put('/api/profile/password')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', activeCookieDevice)
      .send({
        currentPassword: testUser.password,
        newPassword: 'BrandNewPw@123'
      });
    expect(changeRes.status).toBe(200);

    const oldSessionRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', oldCookieDevice);
    expect(oldSessionRes.status).toBe(401);
  });
});
