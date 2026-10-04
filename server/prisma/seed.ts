import bcrypt from 'bcrypt';
import { PrismaClient, Role, TokenType } from '@prisma/client';

const prisma = new PrismaClient();
const BCRYPT_COST = 10;

const categoriesData = [
  { name: 'Cafe', slug: 'cafe' },
  { name: 'Restaurant', slug: 'restaurant' },
  { name: 'Grocery', slug: 'grocery' },
  { name: 'Pharmacy', slug: 'pharmacy' },
  { name: 'Salon', slug: 'salon' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fitness', slug: 'fitness' },
  { name: 'Bookstore', slug: 'bookstore' }
];

async function cleanDatabase() {
  await prisma.rating.deleteMany();
  await prisma.authToken.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
}

async function seedCategories() {
  const created = await Promise.all(
    categoriesData.map((cat) => prisma.category.create({ data: cat }))
  );
  return new Map(created.map((c) => [c.slug, c.id]));
}

async function seedUsers() {
  const adminHash = await bcrypt.hash('Admin@123', BCRYPT_COST);
  const ownerHash = await bcrypt.hash('Owner@123', BCRYPT_COST);
  const userHash = await bcrypt.hash('User@123', BCRYPT_COST);

  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@hallmarq.com',
      passwordHash: adminHash,
      address: '100 Central Administration Blvd, Suite 400',
      role: Role.ADMIN,
      emailVerified: true
    }
  });

  const owners = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Oliver Bennett',
        email: 'owner1@hallmarq.com',
        passwordHash: ownerHash,
        address: '142 Espresso Avenue, Downtown District',
        role: Role.OWNER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Sophia Rodriguez',
        email: 'owner2@hallmarq.com',
        passwordHash: ownerHash,
        address: '88 Olive Branch Way, Old Town',
        role: Role.OWNER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Marcus Vance',
        email: 'owner3@hallmarq.com',
        passwordHash: ownerHash,
        address: '505 Harvest Boulevard, North End',
        role: Role.OWNER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Elena Rostova',
        email: 'owner4@hallmarq.com',
        passwordHash: ownerHash,
        address: '770 Innovation Way, Tech Corridor',
        role: Role.OWNER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'David Kim',
        email: 'owner5@hallmarq.com',
        passwordHash: ownerHash,
        address: '22 Blossom Lane, Garden Quarter',
        role: Role.OWNER,
        emailVerified: true
      }
    })
  ]);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alexander Mitchell',
        email: 'user1@hallmarq.com',
        passwordHash: userHash,
        address: '12 Maple Leaf Street, Apt 3B',
        role: Role.USER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Charlotte Sterling',
        email: 'user2@hallmarq.com',
        passwordHash: userHash,
        address: '45 Sunset Boulevard, West End',
        role: Role.USER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Benjamin Walker',
        email: 'user3@hallmarq.com',
        passwordHash: userHash,
        address: '78 Pinecrest Road, North Quarter',
        role: Role.USER,
        emailVerified: true
      }
    })
  ]);

  return { admin, owners, users };
}

async function seedStores(categoryMap: Map<string, number>, owners: Array<{ id: number }>) {
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'The Rustic Coffeehouse',
        email: 'contact@rusticcoffee.com',
        address: '142 Espresso Avenue, Downtown District',
        categoryId: categoryMap.get('cafe')!,
        ownerId: owners[0].id
      }
    }),
    prisma.store.create({
      data: {
        name: 'Bella Cucina Trattoria',
        email: 'contact@bellacucina.com',
        address: '88 Olive Branch Way, Old Town',
        categoryId: categoryMap.get('restaurant')!,
        ownerId: owners[1].id
      }
    }),
    prisma.store.create({
      data: {
        name: 'Green Valley Organics',
        email: 'info@greenvalleyorganics.com',
        address: '505 Harvest Boulevard, North End',
        categoryId: categoryMap.get('grocery')!,
        ownerId: owners[2].id
      }
    }),
    prisma.store.create({
      data: {
        name: 'TechNova Electronics',
        email: 'support@technova.com',
        address: '770 Innovation Way, Tech Corridor',
        categoryId: categoryMap.get('electronics')!,
        ownerId: owners[3].id
      }
    }),
    prisma.store.create({
      data: {
        name: 'Serenity Spa & Salon',
        email: 'appointments@serenityspa.com',
        address: '22 Blossom Lane, Garden Quarter',
        categoryId: categoryMap.get('salon')!,
        ownerId: owners[4].id
      }
    })
  ]);

  return stores;
}

async function seedRatings(users: Array<{ id: number }>, stores: Array<{ id: number }>) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const ratingsList = [
    { uIdx: 0, sIdx: 0, val: 5, daysAgo: 1, cmt: 'Exceptional coffee aroma and cozy seating atmosphere.' },
    { uIdx: 1, sIdx: 0, val: 4, daysAgo: 4, cmt: 'Smooth latte and very polite staff.' },
    { uIdx: 2, sIdx: 0, val: 5, daysAgo: 8, cmt: 'Best single origin espresso in the city.' },
    { uIdx: 0, sIdx: 1, val: 4, daysAgo: 2, cmt: 'Crispy stone-baked pizza with rich mozzarella.' },
    { uIdx: 1, sIdx: 1, val: 5, daysAgo: 5, cmt: 'Authentic handmade pasta and wonderful ambience.' },
    { uIdx: 2, sIdx: 1, val: 3, daysAgo: 9, cmt: 'Great food, but service was somewhat slow on Friday night.' },
    { uIdx: 0, sIdx: 2, val: 5, daysAgo: 3, cmt: 'Fresh produce, crisp greens, and ethical sourcing.' },
    { uIdx: 1, sIdx: 2, val: 4, daysAgo: 6, cmt: 'Great organic selection though slightly pricey.' },
    { uIdx: 2, sIdx: 2, val: 5, daysAgo: 11, cmt: 'High quality local fruits and very clean aisles.' },
    { uIdx: 0, sIdx: 3, val: 4, daysAgo: 2, cmt: 'Knowledgeable tech staff and quick warranty support.' },
    { uIdx: 1, sIdx: 3, val: 3, daysAgo: 7, cmt: 'Good product range but waiting line was long.' },
    { uIdx: 2, sIdx: 3, val: 4, daysAgo: 12, cmt: 'Competitive pricing on accessories and laptops.' },
    { uIdx: 0, sIdx: 4, val: 5, daysAgo: 1, cmt: 'Relaxing environment and expert therapists.' },
    { uIdx: 1, sIdx: 4, val: 4, daysAgo: 5, cmt: 'Clean facilities and calming aromatherapy.' },
    { uIdx: 2, sIdx: 4, val: 2, daysAgo: 10, cmt: 'Appointment started 20 minutes behind schedule.' }
  ];

  for (const r of ratingsList) {
    const createdAt = new Date(now - r.daysAgo * dayMs);
    await prisma.rating.create({
      data: {
        userId: users[r.uIdx].id,
        storeId: stores[r.sIdx].id,
        value: r.val,
        comment: r.cmt,
        createdAt,
        updatedAt: createdAt
      }
    });
  }
}

async function seedAuthTokens(users: Array<{ id: number }>) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.authToken.create({
    data: {
      userId: users[0].id,
      type: TokenType.EMAIL_VERIFY,
      tokenHash: 'seeded_verify_token_hash_user_1',
      expiresAt
    }
  });
  await prisma.authToken.create({
    data: {
      userId: users[1].id,
      type: TokenType.PASSWORD_RESET,
      tokenHash: 'seeded_reset_token_hash_user_2',
      expiresAt
    }
  });
}

async function main() {
  process.stdout.write('Resetting database...\n');
  await cleanDatabase();

  process.stdout.write('Seeding categories...\n');
  const categoryMap = await seedCategories();

  process.stdout.write('Seeding 1 Admin, 5 Store Owners, and 3 Users...\n');
  const { owners, users } = await seedUsers();

  process.stdout.write('Seeding 5 stores assigned to owners...\n');
  const stores = await seedStores(categoryMap, owners);

  process.stdout.write('Seeding ratings with comments and varied dates...\n');
  await seedRatings(users, stores);

  process.stdout.write('Seeding auth tokens for verification and reset testing...\n');
  await seedAuthTokens(users);

  process.stdout.write('Database reset and seed complete!\n');
}

main()
  .catch((e) => {
    process.stderr.write(String(e) + '\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
