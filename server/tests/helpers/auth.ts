import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { prisma } from '../../src/db/prisma.js';
import { signAuthToken, AUTH_COOKIE_NAME } from '../../src/utils/token.js';

export const createTestUser = async (role: Role = Role.USER, overrides: Partial<{
  email: string;
  name: string;
  password: string;
  emailVerified: boolean;
}> = {}) => {
  const email = overrides.email || `test_${role.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(7)}@rateit.com`;
  const name = overrides.name || 'Standard Test User Name Long';
  const password = overrides.password || 'TestPassword@123';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      address: '100 Test Avenue, City Center',
      passwordHash,
      role,
      emailVerified: overrides.emailVerified !== undefined ? overrides.emailVerified : true
    }
  });

  const token = signAuthToken({
    userId: user.id,
    tokenVersion: user.tokenVersion
  });

  const cookie = `${AUTH_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax`;

  return { user, cookie, password };
};

export const createTestCategory = async (name: string = 'Test Category') => {
  const uniqueName = `${name} ${Date.now()} ${Math.random().toString(36).substring(7)}`;
  const slug = uniqueName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return prisma.category.create({
    data: {
      name: uniqueName,
      slug
    }
  });
};

export const createTestStore = async (categoryId: number, ownerId?: number) => {
  const uniqueName = `Test Store ${Date.now()} ${Math.random().toString(36).substring(7)}`;
  const uniqueEmail = `store_${Date.now()}_${Math.random().toString(36).substring(7)}@rateit.com`;
  return prisma.store.create({
    data: {
      name: uniqueName,
      email: uniqueEmail,
      address: '123 Market Street, Test District',
      categoryId,
      ownerId: ownerId || null
    }
  });
};
