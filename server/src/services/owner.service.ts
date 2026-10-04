import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';
import { parsePagination } from '../utils/pagination.js';
import { parseSort } from '../utils/sort.js';

export const getOwnerDashboard = async (ownerId: number, query: Record<string, unknown>) => {
  const store = await prisma.store.findUnique({
    where: { ownerId },
    include: {
      category: { select: { id: true, name: true, slug: true } }
    }
  });

  const pagination = parsePagination(query.page, query.limit);

  if (!store) {
    return {
      store: null,
      averageRating: null,
      ratingCount: 0,
      distribution: [1, 2, 3, 4, 5].map((stars) => ({ stars, count: 0 })),
      raters: {
        data: [],
        meta: pagination.buildMeta(0)
      }
    };
  }

  const allRatings = await prisma.rating.findMany({
    where: { storeId: store.id },
    select: { value: true }
  });

  const ratingCount = allRatings.length;
  const sum = allRatings.reduce((acc, r) => acc + r.value, 0);
  const averageRating = ratingCount > 0 ? Math.round((sum / ratingCount) * 10) / 10 : null;

  const distribution = [1, 2, 3, 4, 5].map((stars) => ({
    stars,
    count: allRatings.filter((r) => r.value === stars).length
  }));

  const allowedSortFields = {
    name: 'name',
    value: 'value',
    ratedAt: 'createdAt'
  } as const;

  const { sortBy, order } = parseSort(
    query.sortBy,
    query.order,
    allowedSortFields,
    'createdAt',
    'desc'
  );

  let orderBy: Prisma.RatingOrderByWithRelationInput[];
  if (sortBy === 'name') {
    orderBy = [{ user: { name: order } }, { id: 'desc' }];
  } else {
    orderBy = [{ [sortBy]: order }, { id: 'desc' }];
  }

  const [ratersData, total] = await Promise.all([
    prisma.rating.findMany({
      where: { storeId: store.id },
      skip: pagination.skip,
      take: pagination.take,
      orderBy,
      select: {
        id: true,
        value: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }),
    prisma.rating.count({ where: { storeId: store.id } })
  ]);

  const raters = ratersData.map((r) => ({
    id: r.id,
    name: r.user.name,
    email: r.user.email,
    user: {
      name: r.user.name,
      email: r.user.email
    },
    value: r.value,
    comment: r.comment,
    createdAt: r.createdAt,
    ratedAt: r.createdAt
  }));

  const distributionObj: Record<number, number> = {};
  for (const d of distribution) {
    distributionObj[d.stars] = d.count;
  }

  const meta = pagination.buildMeta(total);

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      category: store.category,
      rating: {
        average: averageRating ? averageRating.toFixed(1) : '0.0',
        count: ratingCount,
        distribution: distributionObj
      },
      raters,
      pagination: meta
    },
    averageRating: averageRating ? averageRating.toFixed(1) : '0.0',
    ratingCount,
    distribution: distributionObj,
    raters: {
      data: raters,
      meta
    }
  };
};

export const updateOwnerStoreName = async (ownerId: number, newName: string) => {
  const store = await prisma.store.findUnique({
    where: { ownerId }
  });

  if (!store) {
    throw new HttpError(404, 'No store associated with your account');
  }

  const updated = await prisma.store.update({
    where: { id: store.id },
    data: { name: newName.trim() },
    include: {
      category: { select: { id: true, name: true, slug: true } }
    }
  });

  return { store: updated };
};
