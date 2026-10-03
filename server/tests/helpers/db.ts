import { prisma } from '../../src/db/prisma.js';

export const resetTestDb = async (): Promise<void> => {
  await prisma.rating.deleteMany();
  await prisma.authToken.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
};
