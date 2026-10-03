import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetTestDb } from './helpers/db.js';
import { createTestUser, createTestCategory, createTestStore } from './helpers/auth.js';

describe('Validation rules', () => {
  const app = createApp();
  let userCookie: string;
  let storeId: number;

  beforeAll(async () => {
    await resetTestDb();
    const { cookie } = await createTestUser();
    userCookie = cookie;
    const cat = await createTestCategory();
    const store = await createTestStore(cat.id);
    storeId = store.id;
  });

  it('rejects name with 19 characters (too short)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        name: 'a'.repeat(19),
        email: 'val19@rateit.com',
        address: '123 Main Street',
        password: 'Password@123'
      });
    expect(res.status).toBe(400);
    expect(res.body.errors?.name).toBeDefined();
  });

  it('rejects name with 61 characters (too long)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        name: 'a'.repeat(61),
        email: 'val61@rateit.com',
        address: '123 Main Street',
        password: 'Password@123'
      });
    expect(res.status).toBe(400);
    expect(res.body.errors?.name).toBeDefined();
  });

  it('rejects address with 401 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        name: 'Valid Name Exactly Long Enough',
        email: 'valaddr@rateit.com',
        address: 'a'.repeat(401),
        password: 'Password@123'
      });
    expect(res.status).toBe(400);
    expect(res.body.errors?.address).toBeDefined();
  });

  it('rejects password without uppercase letter', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        name: 'Valid Name Exactly Long Enough',
        email: 'valnoupper@rateit.com',
        address: '123 Main Street',
        password: 'password@123'
      });
    expect(res.status).toBe(400);
    expect(res.body.errors?.password).toBeDefined();
  });

  it('rejects password without special character', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        name: 'Valid Name Exactly Long Enough',
        email: 'valnospecial@rateit.com',
        address: '123 Main Street',
        password: 'Password123'
      });
    expect(res.status).toBe(400);
    expect(res.body.errors?.password).toBeDefined();
  });

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        name: 'Valid Name Exactly Long Enough',
        email: 'not-an-email',
        address: '123 Main Street',
        password: 'Password@123'
      });
    expect(res.status).toBe(400);
    expect(res.body.errors?.email).toBeDefined();
  });

  it('rejects rating value 0 and 6', async () => {
    const res0 = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', userCookie)
      .send({ value: 0 });
    expect(res0.status).toBe(400);

    const res6 = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', userCookie)
      .send({ value: 6 });
    expect(res6.status).toBe(400);
  });

  it('rejects comment of 501 characters', async () => {
    const res = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', userCookie)
      .send({ value: 5, comment: 'a'.repeat(501) });
    expect(res.status).toBe(400);
  });

  it('rejects unknown body fields strictly to prevent mass assignment', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({
        name: 'Valid Name Exactly Long Enough',
        email: 'valstrict@rateit.com',
        address: '123 Main Street',
        password: 'Password@123',
        role: 'ADMIN',
        extraField: true
      });
    expect(res.status).toBe(400);
  });
});
