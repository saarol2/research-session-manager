import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Luo käyttäjiä
  const researcher = await prisma.user.upsert({
    where: { email: 'researcher@example.com' },
    update: {},
    create: {
      email: 'researcher@example.com',
      password: 'hashed_password_here', // TODO: Käytä oikeaa hashausta
    },
  });
  console.log('Created user:', researcher.email);

  // Luo tutkimus
  const study = await prisma.study.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Käytettävyystutkimus',
      description: 'Testaamme uuden sovelluksen käytettävyyttä',
    },
  });
  console.log('Created study:', study.title);

  // Luo sessio
  const session = await prisma.session.upsert({
    where: { id: 1 },
    update: {},
    create: {
      studyId: study.id,
      location: 'Huone A123',
      date: new Date('2025-01-15'),
    },
  });
  console.log('Created session:', session.location);

  // Luo aikavälejä
  const slots = await Promise.all([
    prisma.timeSlot.upsert({
      where: { id: 1 },
      update: {},
      create: {
        sessionId: session.id,
        startTime: new Date('2025-01-15T09:00:00'),
        endTime: new Date('2025-01-15T09:30:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 2 },
      update: {},
      create: {
        sessionId: session.id,
        startTime: new Date('2025-01-15T09:30:00'),
        endTime: new Date('2025-01-15T10:00:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 3 },
      update: {},
      create: {
        sessionId: session.id,
        startTime: new Date('2025-01-15T10:00:00'),
        endTime: new Date('2025-01-15T10:30:00'),
        capacity: 1,
      },
    }),
  ]);
  console.log('Created', slots.length, 'time slots');

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
