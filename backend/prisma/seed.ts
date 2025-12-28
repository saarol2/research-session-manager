import { PrismaClient } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create user
  const researcher = await prisma.user.upsert({
    where: { email: 'researcher@example.com' },
    update: {},
    create: {
      email: 'researcher@example.com',
      password: hashedPassword,
      name: 'Test Researcher',
      role: 'researcher',
    },
  });
  console.log('Created user:', researcher.email);

  // Create study
  const study = await prisma.study.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Käytettävyystutkimus',
      description: 'Testaamme uuden sovelluksen käytettävyyttä',
      ownerId: researcher.id,
    },
  });
  console.log('Created study:', study.title);

  // Create session
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

  // Create time slots
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

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
