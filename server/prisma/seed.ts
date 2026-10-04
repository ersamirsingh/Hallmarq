import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const BCRYPT_COST = 12;

const initialCategories = [
  { name: 'Cafe', slug: 'cafe' },
  { name: 'Restaurant', slug: 'restaurant' },
  { name: 'Grocery', slug: 'grocery' },
  { name: 'Pharmacy', slug: 'pharmacy' },
  { name: 'Salon', slug: 'salon' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Fitness', slug: 'fitness' },
  { name: 'Bookstore', slug: 'bookstore' }
];

async function main() {
  for (const cat of initialCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat
    });
  }

  const adminPasswordHash = await bcrypt.hash('Admin@12345', BCRYPT_COST);
  await prisma.user.upsert({
    where: { email: 'admin@rateit.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@rateit.com',
      passwordHash: adminPasswordHash,
      address: '100 Central Administration Blvd, Suite 400',
      role: Role.ADMIN,
      emailVerified: true
    }
  });
}

main()
  .catch((e) => {
    process.stderr.write(String(e) + '\n');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
