import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetTestDb } from './helpers/db.js';
import { createTestUser, createTestCategory, createTestStore } from './helpers/auth.js';

describe('Security and injection defenses', () => {
  const app = createApp();
  let userCookie: string;
  let adminCookie: string;

  beforeAll(async () => {
    await resetTestDb();
    const u = await createTestUser('USER');
    userCookie = u.cookie;

    const a = await createTestUser('ADMIN');
    adminCookie = a.cookie;

    const cat = await createTestCategory();
    await createTestStore(cat.id);
  });

  it('handles SQL injection attempts in sortBy safely without throwing 500', async () => {
    const res = await request(app)
      .get('/api/admin/users?sortBy=name;drop table "User"')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('handles SQL injection attempts in search safely without throwing 500', async () => {
    const res = await request(app)
      .get("/api/stores?search=' OR 1=1 --")
      .set('Cookie', userCookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('escapes % wildcard in search so it does not match all records', async () => {
    const res = await request(app)
      .get('/api/stores?search=%')
      .set('Cookie', userCookie);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('rejects operator injection object on login body with 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: { $gt: '' }, password: 'Password@123' });

    expect(res.status).toBe(400);
    expect(res.status).not.toBe(500);
  });

  it('handles array query parameter injection safely without throwing 500', async () => {
    const res = await request(app)
      .get('/api/admin/users?name[]=a&name[]=b')
      .set('Cookie', adminCookie);

    expect(res.status).toBeLessThan(500);
  });

  it('returns 429 with Retry-After header on 11th failed login attempt in window', async () => {
    const targetEmail = `rate_limit_test_${Date.now()}@rateit.com`;

    for (let i = 1; i <= 10; i++) {
      const res = await request(app)
        .post('/api/auth/login')
        .set('X-Requested-With', 'XMLHttpRequest')
        .send({ email: targetEmail, password: 'WrongPassword@123' });
      expect(res.status).toBe(401);
    }

    const res11 = await request(app)
      .post('/api/auth/login')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: targetEmail, password: 'WrongPassword@123' });

    expect(res11.status).toBe(429);
    expect(res11.headers['retry-after']).toBeDefined();
  });
});
