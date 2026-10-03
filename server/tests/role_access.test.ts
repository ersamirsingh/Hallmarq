import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { resetTestDb } from './helpers/db.js';
import { createTestUser, createTestCategory, createTestStore } from './helpers/auth.js';

describe('Role access and permission matrix', () => {
  const app = createApp();

  let userCookie: string;
  let owner1Cookie: string;
  let owner2Cookie: string;
  let adminCookie: string;
  let owner1Id: number;
  let owner2Id: number;
  let testStoreId: number;

  beforeAll(async () => {
    await resetTestDb();

    const u = await createTestUser('USER');
    userCookie = u.cookie;

    const o1 = await createTestUser('OWNER');
    owner1Cookie = o1.cookie;
    owner1Id = o1.user.id;

    const o2 = await createTestUser('OWNER');
    owner2Cookie = o2.cookie;
    owner2Id = o2.user.id;

    const a = await createTestUser('ADMIN');
    adminCookie = a.cookie;

    const cat = await createTestCategory();
    const s1 = await createTestStore(cat.id, owner1Id);
    testStoreId = s1.id;
    await createTestStore(cat.id, owner2Id);
  });

  const routes = [
    {
      group: 'Auth me',
      method: 'get' as const,
      path: '/api/auth/me',
      expected: { anon: 401, user: 200, owner: 200, admin: 200 }
    },
    {
      group: 'Profile',
      method: 'get' as const,
      path: '/api/profile',
      expected: { anon: 401, user: 200, owner: 200, admin: 200 }
    },
    {
      group: 'Categories',
      method: 'get' as const,
      path: '/api/categories',
      expected: { anon: 401, user: 200, owner: 200, admin: 200 }
    },
    {
      group: 'Stores list',
      method: 'get' as const,
      path: '/api/stores',
      expected: { anon: 401, user: 200, owner: 403, admin: 403 }
    },
    {
      group: 'Owner dashboard',
      method: 'get' as const,
      path: '/api/owner/dashboard',
      expected: { anon: 401, user: 403, owner: 200, admin: 403 }
    },
    {
      group: 'Admin stats',
      method: 'get' as const,
      path: '/api/admin/stats',
      expected: { anon: 401, user: 403, owner: 403, admin: 200 }
    },
    {
      group: 'Admin users',
      method: 'get' as const,
      path: '/api/admin/users',
      expected: { anon: 401, user: 403, owner: 403, admin: 200 }
    },
    {
      group: 'Admin stores',
      method: 'get' as const,
      path: '/api/admin/stores',
      expected: { anon: 401, user: 403, owner: 403, admin: 200 }
    }
  ];

  for (const r of routes) {
    it(`enforces matrix on ${r.group} (${r.path})`, async () => {
      const resAnon = await request(app)[r.method](r.path);
      expect(resAnon.status).toBe(r.expected.anon);

      const resUser = await request(app)[r.method](r.path).set('Cookie', userCookie);
      expect(resUser.status).toBe(r.expected.user);

      const resOwner = await request(app)[r.method](r.path).set('Cookie', owner1Cookie);
      expect(resOwner.status).toBe(r.expected.owner);

      const resAdmin = await request(app)[r.method](r.path).set('Cookie', adminCookie);
      expect(resAdmin.status).toBe(r.expected.admin);
    });
  }

  it('prevents IDOR: an owner only sees their own store dashboard and not another owner store', async () => {
    const res1 = await request(app)
      .get('/api/owner/dashboard')
      .set('Cookie', owner1Cookie);
    expect(res1.status).toBe(200);

    const res2 = await request(app)
      .get('/api/owner/dashboard')
      .set('Cookie', owner2Cookie);
    expect(res2.status).toBe(200);

    expect(res1.body.store?.id).not.toBe(res2.body.store?.id);
  });
});
