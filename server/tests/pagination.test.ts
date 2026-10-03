import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetTestDb } from './helpers/db.js';
import { createTestUser, createTestCategory, createTestStore } from './helpers/auth.js';

describe('Pagination and ordering behavior', () => {
  const app = createApp();
  let userCookie: string;

  beforeAll(async () => {
    await resetTestDb();
    const u = await createTestUser('USER');
    userCookie = u.cookie;

    const cat = await createTestCategory();
    for (let i = 1; i <= 25; i++) {
      await createTestStore(cat.id);
    }
  });

  it('clamps limit=1000 to maximum of 50', async () => {
    const res = await request(app)
      .get('/api/stores?limit=1000')
      .set('Cookie', userCookie);

    expect(res.status).toBe(200);
    expect(res.body.meta.limit).toBe(50);
  });

  it('rejects page=0 with 400', async () => {
    const res = await request(app)
      .get('/api/stores?page=0')
      .set('Cookie', userCookie);

    expect(res.status).toBe(400);
  });

  it('ensures pages do not overlap and meta contains valid values', async () => {
    const page1Res = await request(app)
      .get('/api/stores?page=1&limit=10')
      .set('Cookie', userCookie);

    const page2Res = await request(app)
      .get('/api/stores?page=2&limit=10')
      .set('Cookie', userCookie);

    expect(page1Res.status).toBe(200);
    expect(page2Res.status).toBe(200);

    const page1Ids = page1Res.body.data.map((s: any) => s.id);
    const page2Ids = page2Res.body.data.map((s: any) => s.id);

    const overlap = page1Ids.filter((id: number) => page2Ids.includes(id));
    expect(overlap).toHaveLength(0);

    expect(page1Res.body.meta.page).toBe(1);
    expect(page1Res.body.meta.limit).toBe(10);
    expect(page1Res.body.meta.total).toBe(25);
    expect(page1Res.body.meta.totalPages).toBe(3);
    expect(page1Res.body.meta.hasNext).toBe(true);

    const page3Res = await request(app)
      .get('/api/stores?page=3&limit=10')
      .set('Cookie', userCookie);
    expect(page3Res.body.meta.hasNext).toBe(false);
  });
});
