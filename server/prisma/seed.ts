import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const BCRYPT_COST = 10;

async function main() {
  await prisma.rating.deleteMany();
  await prisma.authToken.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

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

  const categories = await Promise.all(
    categoriesData.map((cat) => prisma.category.create({ data: cat }))
  );

  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  const adminPasswordHash = await bcrypt.hash('Admin@12345', BCRYPT_COST);
  const ownerPasswordHash = await bcrypt.hash('Owner@12345', BCRYPT_COST);
  const userPasswordHash = await bcrypt.hash('User@12345', BCRYPT_COST);

  await prisma.user.create({
    data: {
      name: 'System Administrator Account',
      email: 'admin@rateit.com',
      passwordHash: adminPasswordHash,
      address: '100 Central Administration Blvd, Suite 400',
      role: Role.ADMIN,
      emailVerified: true
    }
  });

  const owner1 = await prisma.user.create({
    data: {
      name: 'Oliver Bennett Kingston',
      email: 'owner1@rateit.com',
      passwordHash: ownerPasswordHash,
      address: '142 Espresso Avenue, Downtown District',
      role: Role.OWNER,
      emailVerified: true
    }
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Sophia Elena Rodriguez',
      email: 'owner2@rateit.com',
      passwordHash: ownerPasswordHash,
      address: '88 Olive Branch Way, Old Town',
      role: Role.OWNER,
      emailVerified: true
    }
  });

  const owner3 = await prisma.user.create({
    data: {
      name: 'Marcus Aurelius Vance',
      email: 'owner3@rateit.com',
      passwordHash: ownerPasswordHash,
      address: '505 Harvest Boulevard, North End',
      role: Role.OWNER,
      emailVerified: true
    }
  });

  const normalUsers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alexander James Mitchell',
        email: 'user1@rateit.com',
        passwordHash: userPasswordHash,
        address: '12 Maple Leaf Street, Apt 3B',
        role: Role.USER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Charlotte Grace Sterling',
        email: 'user2@rateit.com',
        passwordHash: userPasswordHash,
        address: '45 Sunset Boulevard, West End',
        role: Role.USER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Benjamin Thomas Walker',
        email: 'user3@rateit.com',
        passwordHash: userPasswordHash,
        address: '78 Pinecrest Road, North Quarter',
        role: Role.USER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Eleanor Victoria Hayes',
        email: 'user4@rateit.com',
        passwordHash: userPasswordHash,
        address: '92 Willow Creek Way, Suite 10',
        role: Role.USER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Daniel Christopher Reed',
        email: 'user5@rateit.com',
        passwordHash: userPasswordHash,
        address: '304 Riverdale Crescent, Riverside',
        role: Role.USER,
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: 'Isabella Marie Montgomery',
        email: 'user6@rateit.com',
        passwordHash: userPasswordHash,
        address: '512 Harbor View Terrace, Marina District',
        role: Role.USER,
        emailVerified: true
      }
    })
  ]);

  const store1 = await prisma.store.create({
    data: {
      name: 'The Rustic Artisan Coffeehouse',
      email: 'coffee@rusticartisan.com',
      address: '142 Espresso Avenue, Downtown District',
      categoryId: categoryMap.get('cafe')!,
      ownerId: owner1.id
    }
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Bella Cucina Trattoria & Pizzeria',
      email: 'contact@bellacucina.com',
      address: '88 Olive Branch Way, Old Town',
      categoryId: categoryMap.get('restaurant')!,
      ownerId: owner2.id
    }
  });

  const store3 = await prisma.store.create({
    data: {
      name: 'Green Valley Organic Marketplace',
      email: 'support@greenvalleymarket.com',
      address: '505 Harvest Boulevard, North End',
      categoryId: categoryMap.get('grocery')!,
      ownerId: owner3.id
    }
  });

  const store4 = await prisma.store.create({
    data: {
      name: 'OmniTech Electronics Center',
      email: 'sales@omnitechelectronics.com',
      address: '770 Innovation Way, Tech Corridor',
      categoryId: categoryMap.get('electronics')!
    }
  });

  const store5 = await prisma.store.create({
    data: {
      name: 'Serenity Spa & Hair Lounge',
      email: 'appointments@serenityspa.com',
      address: '22 Blossom Lane, Garden Quarter',
      categoryId: categoryMap.get('salon')!
    }
  });

  const store6 = await prisma.store.create({
    data: {
      name: 'Evergreen Health Pharmacy',
      email: 'care@evergreenpharmacy.com',
      address: '333 Wellness Boulevard, Medical Center',
      categoryId: categoryMap.get('pharmacy')!
    }
  });

  const ratingsSeed = [
    { userIdx: 0, store: store1, value: 5, comment: 'Exceptional coffee aroma and cozy seating atmosphere.' },
    { userIdx: 1, store: store1, value: 4, comment: null },
    { userIdx: 2, store: store1, value: 5, comment: 'Friendly baristas and outstanding single origin pour-over.' },
    { userIdx: 3, store: store1, value: 4, comment: null },
    { userIdx: 4, store: store1, value: 5, comment: 'My favorite spot for morning espresso and study sessions.' },
    { userIdx: 0, store: store2, value: 4, comment: 'Authentic stone oven pizza with crispy thin crust.' },
    { userIdx: 1, store: store2, value: 5, comment: 'The homemade pasta carbonara was rich and delicious.' },
    { userIdx: 2, store: store2, value: 4, comment: null },
    { userIdx: 3, store: store2, value: 3, comment: 'Great food but service was somewhat slow on a Friday night.' },
    { userIdx: 5, store: store2, value: 5, comment: null },
    { userIdx: 1, store: store3, value: 5, comment: 'Fresh farm produce, crisp vegetables, and ethical sourcing.' },
    { userIdx: 2, store: store3, value: 4, comment: null },
    { userIdx: 4, store: store3, value: 4, comment: 'Excellent organic selection though prices can be premium.' },
    { userIdx: 5, store: store3, value: 5, comment: null },
    { userIdx: 0, store: store4, value: 4, comment: 'Helpful technicians and quick warranty support.' },
    { userIdx: 3, store: store4, value: 4, comment: null },
    { userIdx: 2, store: store5, value: 5, comment: 'Skilled stylists and relaxing ambiance.' },
    { userIdx: 4, store: store5, value: 5, comment: null },
    { userIdx: 1, store: store6, value: 5, comment: 'Speedy prescription fulfillment and attentive pharmacists.' },
    { userIdx: 5, store: store6, value: 4, comment: null }
  ];

  for (const r of ratingsSeed) {
    await prisma.rating.create({
      data: {
        userId: normalUsers[r.userIdx].id,
        storeId: r.store.id,
        value: r.value,
        comment: r.comment
      }
    });
  }
}

main()
  .catch((e) => {
    process.stderr.write(String(e) + '\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
