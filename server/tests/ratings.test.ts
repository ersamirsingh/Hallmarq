import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetTestDb } from './helpers/db.js';
import { createTestUser, createTestCategory, createTestStore } from './helpers/auth.js';
import { prisma } from '../src/db/prisma.js';
import { env } from '../src/config/env.js';

describe('Ratings and reviews rules', () => {
  const app = createApp();

  let userCookie: string;
  let userId: number;
  let adminCookie: string;
  let ownerCookie: string;
  let storeId: number;

  beforeAll(async () => {
    await resetTestDb();

    const u = await createTestUser('USER');
    userCookie = u.cookie;
    userId = u.user.id;

    const a = await createTestUser('ADMIN');
    adminCookie = a.cookie;

    const o = await createTestUser('OWNER');
    ownerCookie = o.cookie;

    const cat = await createTestCategory();
    const s = await createTestStore(cat.id, o.user.id);
    storeId = s.id;
  });

  it('admin and owner get 403 when rating a store', async () => {
    const resAdmin = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', adminCookie)
      .send({ value: 5 });
    expect(resAdmin.status).toBe(403);

    const resOwner = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', ownerCookie)
      .send({ value: 5 });
    expect(resOwner.status).toBe(403);
  });

  it('rating twice updates the same row rather than inserting duplicate', async () => {
    const res1 = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', userCookie)
      .send({ value: 4, comment: 'First comment' });
    expect(res1.status).toBe(200);

    const res2 = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', userCookie)
      .send({ value: 5, comment: 'Updated comment' });
    expect(res2.status).toBe(200);
    expect(res2.body.myRating).toBe(5);
    expect(res2.body.myComment).toBe('Updated comment');

    const totalRatings = await prisma.rating.count({
      where: { userId, storeId }
    });
    expect(totalRatings).toBe(1);
  });

  it('keeps previous comment when comment is omitted in update', async () => {
    const res = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', userCookie)
      .send({ value: 3 });

    expect(res.status).toBe(200);
    expect(res.body.myRating).toBe(3);
    expect(res.body.myComment).toBe('Updated comment');
  });

  it('clears comment when comment is explicitly null or empty', async () => {
    const res = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', userCookie)
      .send({ value: 4, comment: null });

    expect(res.status).toBe(200);
    expect(res.body.myRating).toBe(4);
    expect(res.body.myComment).toBeNull();
  });

  it('returns 403 EMAIL_NOT_VERIFIED when email verification is required and user is unverified', async () => {
    const unverified = await createTestUser('USER', { emailVerified: false });

    env.REQUIRE_EMAIL_VERIFICATION = true;

    const res = await request(app)
      .put(`/api/stores/${storeId}/rating`)
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Cookie', unverified.cookie)
      .send({ value: 5 });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('EMAIL_NOT_VERIFIED');

    env.REQUIRE_EMAIL_VERIFICATION = false;
  });
});
