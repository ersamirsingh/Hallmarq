import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
};

export const createCategory = async (name: string) => {
  const trimmedName = name.trim();
  const slug = trimmedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: trimmedName }, { slug }]
    }
  });

  if (existing) {
    throw new HttpError(409, 'A category with this name or slug already exists');
  }

  return prisma.category.create({
    data: {
      name: trimmedName,
      slug
    }
  });
};
