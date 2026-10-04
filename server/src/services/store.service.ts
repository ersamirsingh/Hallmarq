import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';
import { escapeLike } from '../utils/escapeLike.js';
import { parsePagination } from '../utils/pagination.js';
import { calculateWeightedRating } from '../utils/rating.js';
import { env } from '../config/env.js';

export const getUserStores = async (userId: number, query: Record<string, unknown>) => {
  const pagination = parsePagination(query.page, query.limit);

  const rawSort = String(query.sort || query.sortBy || 'all').toLowerCase();
  const sortMode = ['top', 'newest', 'rating', 'name', 'all'].includes(rawSort) ? rawSort : 'all';

  const where: Prisma.StoreWhereInput = {};

  if (typeof query.search === 'string' && query.search.trim()) {
    const term = escapeLike(query.search.trim());
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { address: { contains: term, mode: 'insensitive' } }
    ];
  }

  const catParam = String(query.category || query.categoryId || '').trim();
  if (catParam) {
    const catId = Number(catParam);
    if (!Number.isNaN(catId) && catId > 0) {
      where.categoryId = catId;
    } else {
      where.category = {
        OR: [
          { name: { equals: catParam, mode: 'insensitive' } },
          { slug: { equals: catParam.toLowerCase(), mode: 'insensitive' } }
        ]
      };
    }
  }

  if (sortMode === 'rating' || sortMode === 'top') {
    const [allStores, globalAgg] = await Promise.all([
      prisma.store.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          ratings: { select: { userId: true, value: true, comment: true } }
        }
      }),
      sortMode === 'top' ? prisma.rating.aggregate({ _avg: { value: true } }) : null
    ]);

    const globalAvg = globalAgg?._avg?.value || 0;

    const formatted = allStores.map((s) => {
      const count = s.ratings.length;
      const sum = s.ratings.reduce((acc, r) => acc + r.value, 0);
      const avg = count > 0 ? sum / count : 0;
      const overallRating = count > 0 ? Math.round(avg * 10) / 10 : null;
      const myRatingObj = s.ratings.find((r) => r.userId === userId);
      const sortScore = sortMode === 'top' ? calculateWeightedRating(count, avg, globalAvg) : avg;

      return {
        id: s.id,
        name: s.name,
        address: s.address,
        category: s.category,
        overallRating,
        ratingCount: count,
        myRating: myRatingObj ? myRatingObj.value : null,
        myComment: myRatingObj ? myRatingObj.comment : null,
        sortScore
      };
    });

    formatted.sort((a, b) => {
      if (a.sortScore !== b.sortScore) {
        return b.sortScore - a.sortScore;
      }
      return a.id - b.id;
    });

    const paginated = formatted
      .slice(pagination.skip, pagination.skip + pagination.take)
      .map(({ sortScore: _, ...rest }) => rest);

    const meta = pagination.buildMeta(allStores.length);
    return {
      stores: paginated,
      data: paginated,
      pagination: meta,
      meta
    };
  }

  let orderBy: Prisma.StoreOrderByWithRelationInput[] = [{ id: 'asc' }];
  if (sortMode === 'newest') {
    orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
  } else if (sortMode === 'name') {
    orderBy = [{ name: 'asc' }, { id: 'asc' }];
  } else {
    orderBy = [{ id: 'asc' }];
  }

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        ratings: { select: { userId: true, value: true, comment: true } }
      }
    }),
    prisma.store.count({ where })
  ]);

  const data = stores.map((s) => {
    const count = s.ratings.length;
    const sum = s.ratings.reduce((acc, r) => acc + r.value, 0);
    const overallRating = count > 0 ? Math.round((sum / count) * 10) / 10 : null;
    const myRatingObj = s.ratings.find((r) => r.userId === userId);

    return {
      id: s.id,
      name: s.name,
      address: s.address,
      category: s.category,
      overallRating,
      ratingCount: count,
      myRating: myRatingObj ? myRatingObj.value : null,
      myComment: myRatingObj ? myRatingObj.comment : null
    };
  });

  const meta = pagination.buildMeta(total);
  return {
    stores: data,
    data,
    pagination: meta,
    meta
  };
};

export const rateStore = async (
  userId: number,
  isEmailVerified: boolean,
  storeId: number,
  value: number,
  comment?: string | null
) => {
  if (env.REQUIRE_EMAIL_VERIFICATION && !isEmailVerified) {
    throw new HttpError(
      403,
      'Please verify your email to rate stores',
      undefined,
      'EMAIL_NOT_VERIFIED'
    );
  }

  const store = await prisma.store.findUnique({
    where: { id: storeId }
  });

  if (!store) {
    throw new HttpError(404, 'Store not found');
  }

  const existingRating = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } }
  });

  let finalComment: string | null = null;
  if (comment === undefined) {
    finalComment = existingRating ? existingRating.comment : null;
  } else if (comment === null || comment === '') {
    finalComment = null;
  } else {
    finalComment = comment;
  }

  const upserted = await prisma.rating.upsert({
    where: { userId_storeId: { userId, storeId } },
    create: {
      userId,
      storeId,
      value,
      comment: finalComment
    },
    update: {
      value,
      comment: finalComment
    }
  });

  const aggregate = await prisma.rating.aggregate({
    where: { storeId },
    _avg: { value: true },
    _count: { value: true }
  });

  const count = aggregate._count.value;
  const overallRating = count > 0 && aggregate._avg.value !== null ? Math.round(aggregate._avg.value * 10) / 10 : null;

  return {
    overallRating,
    ratingCount: count,
    myRating: upserted.value,
    myComment: upserted.comment
  };
};

export const getStoreReviews = async (storeId: number, query: Record<string, unknown>) => {
  const store = await prisma.store.findUnique({
    where: { id: storeId }
  });

  if (!store) {
    throw new HttpError(404, 'Store not found');
  }

  const pagination = parsePagination(query.page, query.limit);

  const where: Prisma.RatingWhereInput = {
    storeId,
    comment: {
      not: null
    }
  };

  const [reviews, total] = await Promise.all([
    prisma.rating.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        value: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.rating.count({ where })
  ]);

  const data = reviews.map((r) => ({
    id: r.id,
    reviewerName: r.user.name,
    value: r.value,
    comment: r.comment,
    createdAt: r.createdAt
  }));

  const meta = pagination.buildMeta(total);
  return {
    reviews: data,
    data,
    pagination: meta,
    meta
  };
};
