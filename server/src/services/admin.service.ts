import { Prisma, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { prisma } from '../db/prisma.js';
import { HttpError } from '../utils/httpError.js';
import { escapeLike } from '../utils/escapeLike.js';
import { parsePagination } from '../utils/pagination.js';
import { parseSort } from '../utils/sort.js';
import { env } from '../config/env.js';

export const getAdminStats = async () => {
  const [
    totalUsers,
    totalStores,
    totalRatings,
    usersByRole,
    ratingDistribution,
    categories,
    ratingAgg,
    recentRatings
  ] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
    prisma.user.groupBy({
      by: ['role'],
      _count: { id: true }
    }),
    prisma.rating.groupBy({
      by: ['value'],
      _count: { id: true }
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { stores: true }
        }
      }
    }),
    prisma.rating.aggregate({
      _avg: { value: true }
    }),
    prisma.rating.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        value: true,
        comment: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, email: true }
        },
        store: {
          select: { id: true, name: true }
        }
      }
    })
  ]);

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setHours(0, 0, 0, 0);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);

  const ratingsRecent = await prisma.rating.findMany({
    where: {
      createdAt: {
        gte: fourteenDaysAgo
      }
    },
    select: {
      createdAt: true
    }
  });

  const dailyCounts = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(fourteenDaysAgo);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dailyCounts.set(dateStr, 0);
  }

  for (const r of ratingsRecent) {
    const dateStr = r.createdAt.toISOString().split('T')[0];
    if (dailyCounts.has(dateStr)) {
      dailyCounts.set(dateStr, (dailyCounts.get(dateStr) || 0) + 1);
    }
  }

  const ratingsPerDay = Array.from(dailyCounts.entries()).map(([date, count]) => ({
    date,
    count
  }));

  const distMap = new Map<number, number>(ratingDistribution.map((r) => [r.value, r._count.id]));
  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = distMap.get(stars) || 0;
    const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
    return {
      stars: `${stars} ★`,
      rating: stars,
      count,
      percentage
    };
  });

  const roleMap = new Map<string, number>(usersByRole.map((u) => [u.role, u._count.id]));
  const userBreakdown = {
    USER: roleMap.get('USER') || 0,
    OWNER: roleMap.get('OWNER') || 0,
    ADMIN: roleMap.get('ADMIN') || 0
  };

  const categoryBreakdown = categories
    .map((c) => ({
      id: c.id,
      name: c.name,
      storesCount: c._count.stores
    }))
    .filter((c) => c.storesCount > 0);

  const averageRating = ratingAgg._avg.value ? Math.round(ratingAgg._avg.value * 10) / 10 : 0;

  return {
    totalUsers,
    totalStores,
    totalRatings,
    averageRating,
    ratingBreakdown,
    ratingDistribution: ratingBreakdown,
    userBreakdown,
    categoryBreakdown,
    recentRatings,
    ratingsPerDay,
    dailyRatings: ratingsPerDay
  };
};

export const getAdminUsers = async (query: Record<string, unknown>) => {
  const pagination = parsePagination(query.page, query.limit);

  const allowedSortFields = {
    name: 'name',
    email: 'email',
    address: 'address',
    role: 'role',
    createdAt: 'createdAt'
  } as const;

  const rawOrder = query.order ?? query.sortOrder;
  const { sortBy, order } = parseSort(
    query.sortBy,
    rawOrder,
    allowedSortFields,
    'createdAt',
    'desc'
  );

  const where: Prisma.UserWhereInput = {};

  if (typeof query.search === 'string' && query.search.trim()) {
    const term = escapeLike(query.search.trim());
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
      { address: { contains: term, mode: 'insensitive' } }
    ];
  } else {
    if (typeof query.name === 'string' && query.name.trim()) {
      where.name = { contains: escapeLike(query.name.trim()), mode: 'insensitive' };
    }
    if (typeof query.email === 'string' && query.email.trim()) {
      where.email = { contains: escapeLike(query.email.trim()), mode: 'insensitive' };
    }
    if (typeof query.address === 'string' && query.address.trim()) {
      where.address = { contains: escapeLike(query.address.trim()), mode: 'insensitive' };
    }
  }

  if (typeof query.role === 'string' && ['ADMIN', 'USER', 'OWNER', 'STORE_OWNER'].includes(query.role.trim().toUpperCase())) {
    const roleValue = query.role.trim().toUpperCase() === 'STORE_OWNER' ? 'OWNER' : query.role.trim().toUpperCase();
    where.role = roleValue as Role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: [{ [sortBy]: order }, { id: 'desc' }],
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        emailVerified: true,
        createdAt: true
      }
    }),
    prisma.user.count({ where })
  ]);

  const meta = pagination.buildMeta(total);
  return {
    users,
    data: users,
    pagination: meta,
    meta
  };
};

export const createAdminUser = async (data: {
  name: string;
  email: string;
  address: string;
  password: string;
  role: Role;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existing) {
    throw new HttpError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(data.password, env.BCRYPT_COST);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      passwordHash,
      role: data.role,
      emailVerified: true
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      emailVerified: true,
      createdAt: true
    }
  });

  return user;
};

export const getAdminUserDetails = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      ownedStore: {
        select: {
          id: true,
          name: true,
          ratings: {
            select: {
              value: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  let storeName: string | null = null;
  let storeRating: number | null = null;

  if (user.role === Role.OWNER && user.ownedStore) {
    storeName = user.ownedStore.name;
    const ratings = user.ownedStore.ratings;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, r) => acc + r.value, 0);
      storeRating = Math.round((sum / ratings.length) * 10) / 10;
    }
  }

  const { ownedStore: _, ...userFields } = user;

  return {
    ...userFields,
    ...(user.role === Role.OWNER ? { storeName, storeRating } : {})
  };
};

export const getAdminStores = async (query: Record<string, unknown>) => {
  const pagination = parsePagination(query.page, query.limit);

  const allowedSortFields = {
    name: 'name',
    email: 'email',
    address: 'address',
    category: 'category',
    rating: 'rating'
  } as const;

  const rawOrder = query.order ?? query.sortOrder;
  const { sortBy, order } = parseSort(
    query.sortBy,
    rawOrder,
    allowedSortFields,
    'name',
    'asc'
  );

  const where: Prisma.StoreWhereInput = {};

  if (typeof query.search === 'string' && query.search.trim()) {
    const term = escapeLike(query.search.trim());
    where.OR = [
      { name: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
      { address: { contains: term, mode: 'insensitive' } }
    ];
  } else {
    if (typeof query.name === 'string' && query.name.trim()) {
      where.name = { contains: escapeLike(query.name.trim()), mode: 'insensitive' };
    }
    if (typeof query.email === 'string' && query.email.trim()) {
      where.email = { contains: escapeLike(query.email.trim()), mode: 'insensitive' };
    }
    if (typeof query.address === 'string' && query.address.trim()) {
      where.address = { contains: escapeLike(query.address.trim()), mode: 'insensitive' };
    }
  }

  if (query.categoryId !== undefined && query.categoryId !== null && query.categoryId !== '') {
    const catId = Number(query.categoryId);
    if (!Number.isNaN(catId) && catId > 0) {
      where.categoryId = catId;
    }
  } else if (query.category !== undefined && query.category !== null && query.category !== '') {
    const catStr = String(query.category).trim();
    const catIdNum = Number(catStr);
    if (!Number.isNaN(catIdNum) && catIdNum > 0) {
      where.categoryId = catIdNum;
    } else {
      where.category = {
        OR: [
          { name: { equals: catStr, mode: 'insensitive' } },
          { slug: { equals: catStr.toLowerCase(), mode: 'insensitive' } }
        ]
      };
    }
  }

  let stores;
  let total;

  if (sortBy === 'rating') {
    const allStores = await prisma.store.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        owner: { select: { id: true, name: true, email: true } },
        ratings: { select: { value: true } }
      }
    });

    total = allStores.length;

    const formatted = allStores.map((s) => {
      const count = s.ratings.length;
      const sum = s.ratings.reduce((acc, r) => acc + r.value, 0);
      const rating = count > 0 ? Math.round((sum / count) * 10) / 10 : null;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        category: s.category,
        owner: s.owner,
        rating: {
          average: rating,
          count
        },
        ratingValue: rating,
        ratingCount: count
      };
    });

    formatted.sort((a, b) => {
      const rA = a.ratingValue ?? -1;
      const rB = b.ratingValue ?? -1;
      if (rA !== rB) {
        return order === 'asc' ? rA - rB : rB - rA;
      }
      return order === 'asc' ? a.id - b.id : b.id - a.id;
    });

    stores = formatted.slice(pagination.skip, pagination.skip + pagination.take);
  } else {
    let orderBy: Prisma.StoreOrderByWithRelationInput[];
    if (sortBy === 'category') {
      orderBy = [{ category: { name: order } }, { id: 'asc' }];
    } else {
      orderBy = [{ [sortBy]: order }, { id: 'asc' }];
    }

    const [dbStores, count] = await Promise.all([
      prisma.store.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          owner: { select: { id: true, name: true, email: true } },
          ratings: { select: { value: true } }
        }
      }),
      prisma.store.count({ where })
    ]);

    total = count;
    stores = dbStores.map((s) => {
      const ratingCount = s.ratings.length;
      const sum = s.ratings.reduce((acc, r) => acc + r.value, 0);
      const rating = ratingCount > 0 ? Math.round((sum / ratingCount) * 10) / 10 : null;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        category: s.category,
        owner: s.owner,
        rating: {
          average: rating,
          count: ratingCount
        },
        ratingValue: rating,
        ratingCount
      };
    });
  }

  const meta = pagination.buildMeta(total);
  return {
    stores,
    data: stores,
    pagination: meta,
    meta
  };
};

export const createAdminStore = async (data: {
  name: string;
  email: string;
  address: string;
  categoryId: number;
  ownerId?: number | null;
}) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId }
  });

  if (!category) {
    throw new HttpError(400, 'Selected category does not exist');
  }

  const existingStore = await prisma.store.findUnique({
    where: { email: data.email }
  });

  if (existingStore) {
    throw new HttpError(409, 'A store with this email already exists');
  }

  if (data.ownerId) {
    const owner = await prisma.user.findUnique({
      where: { id: data.ownerId }
    });

    if (!owner) {
      throw new HttpError(400, 'Owner user not found');
    }

    if (owner.role !== Role.OWNER) {
      throw new HttpError(400, 'Assigned user must have the OWNER role');
    }

    const existingOwned = await prisma.store.findUnique({
      where: { ownerId: data.ownerId }
    });

    if (existingOwned) {
      throw new HttpError(409, 'This owner already has a store assigned');
    }
  }

  return prisma.store.create({
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      categoryId: data.categoryId,
      ownerId: data.ownerId || null
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      owner: { select: { id: true, name: true, email: true } }
    }
  });
};

export const getAvailableOwners = async () => {
  return prisma.user.findMany({
    where: {
      role: Role.OWNER,
      ownedStore: null
    },
    select: {
      id: true,
      name: true,
      email: true
    },
    orderBy: { name: 'asc' }
  });
};

export const getAdminRatings = async (query: Record<string, unknown>) => {
  const pagination = parsePagination(query.page, query.limit);

  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true } }
      }
    }),
    prisma.rating.count()
  ]);

  const meta = pagination.buildMeta(total);
  return {
    ratings,
    data: ratings,
    pagination: meta,
    meta
  };
};
