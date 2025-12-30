import { PrismaClient, Role } from './generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  const researcher = await prisma.user.upsert({
    where: { email: 'researcher@example.com' },
    update: {},
    create: {
      email: 'researcher@example.com',
      password: hashedPassword,
      name: 'Test Researcher',
      role: Role.researcher,
    },
  });
  console.log('Created user:', researcher.email);

  const researcher2 = await prisma.user.upsert({
    where: { email: 'anna.tutkija@example.com' },
    update: {},
    create: {
      email: 'anna.tutkija@example.com',
      password: hashedPassword,
      name: 'Anna Tutkija',
      role: Role.researcher,
    },
  });
  console.log('Created user:', researcher2.email);

  // ============================================
  // STUDY 1: Käytettävyystutkimus
  // ============================================
  const study1 = await prisma.study.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Käytettävyystutkimus',
      description: 'Testaamme uuden mobiilisovelluksen käytettävyyttä. Tutkimuksessa osallistujat suorittavat erilaisia tehtäviä sovelluksella ja antavat palautetta.',
      ownerId: researcher.id,
    },
  });
  console.log('Created study:', study1.title);

  // Study 1, Session 1 (tammikuu)
  const session1_1 = await prisma.session.upsert({
    where: { id: 1 },
    update: {},
    create: {
      studyId: study1.id,
      location: 'Huone A123, Tietotekniikan talo',
      date: new Date('2025-01-15'),
    },
  });

  // Study 1, Session 2 (tammikuu)
  const session1_2 = await prisma.session.upsert({
    where: { id: 2 },
    update: {},
    create: {
      studyId: study1.id,
      location: 'Huone A123, Tietotekniikan talo',
      date: new Date('2025-01-20'),
    },
  });

  // Time slots for session 1_1
  const slots1_1 = await Promise.all([
    prisma.timeSlot.upsert({
      where: { id: 1 },
      update: {},
      create: {
        sessionId: session1_1.id,
        startTime: new Date('2025-01-15T09:00:00'),
        endTime: new Date('2025-01-15T09:30:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 2 },
      update: {},
      create: {
        sessionId: session1_1.id,
        startTime: new Date('2025-01-15T09:30:00'),
        endTime: new Date('2025-01-15T10:00:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 3 },
      update: {},
      create: {
        sessionId: session1_1.id,
        startTime: new Date('2025-01-15T10:00:00'),
        endTime: new Date('2025-01-15T10:30:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 4 },
      update: {},
      create: {
        sessionId: session1_1.id,
        startTime: new Date('2025-01-15T10:30:00'),
        endTime: new Date('2025-01-15T11:00:00'),
        capacity: 1,
      },
    }),
  ]);

  // Time slots for session 1_2
  const slots1_2 = await Promise.all([
    prisma.timeSlot.upsert({
      where: { id: 5 },
      update: {},
      create: {
        sessionId: session1_2.id,
        startTime: new Date('2025-01-20T13:00:00'),
        endTime: new Date('2025-01-20T13:30:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 6 },
      update: {},
      create: {
        sessionId: session1_2.id,
        startTime: new Date('2025-01-20T13:30:00'),
        endTime: new Date('2025-01-20T14:00:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 7 },
      update: {},
      create: {
        sessionId: session1_2.id,
        startTime: new Date('2025-01-20T14:00:00'),
        endTime: new Date('2025-01-20T14:30:00'),
        capacity: 1,
      },
    }),
  ]);

  // Bookings for study 1
  await Promise.all([
    prisma.booking.upsert({
      where: { id: 1 },
      update: {},
      create: {
        slotId: slots1_1[0].id,
        name: 'Matti Meikäläinen',
        email: 'matti@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 2 },
      update: {},
      create: {
        slotId: slots1_1[1].id,
        name: 'Liisa Virtanen',
        email: 'liisa@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 3 },
      update: {},
      create: {
        slotId: slots1_2[0].id,
        name: 'Pekka Korhonen',
        email: 'pekka@example.com',
        consentAt: new Date(),
      },
    }),
  ]);

  // ============================================
  // STUDY 2: Silmänliiketutkimus
  // ============================================
  const study2 = await prisma.study.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Silmänliiketutkimus',
      description: 'Tutkimme käyttäjien silmänliikkeitä verkkosivujen käytön aikana. Eye-tracking-laitteisto seuraa katseen kohdistumista.',
      ownerId: researcher.id,
    },
  });
  console.log('Created study:', study2.title);

  // Study 2, Session 1
  const session2_1 = await prisma.session.upsert({
    where: { id: 3 },
    update: {},
    create: {
      studyId: study2.id,
      location: 'Eye-tracking Lab, B-rakennus',
      date: new Date('2025-01-02'),
    },
  });

  // Study 2, Session 2
  const session2_2 = await prisma.session.upsert({
    where: { id: 4 },
    update: {},
    create: {
      studyId: study2.id,
      location: 'Eye-tracking Lab, B-rakennus',
      date: new Date('2025-01-05'),
    },
  });

  // Time slots for session 2_1
  const slots2_1 = await Promise.all([
    prisma.timeSlot.upsert({
      where: { id: 8 },
      update: {},
      create: {
        sessionId: session2_1.id,
        startTime: new Date('2025-01-02T10:00:00'),
        endTime: new Date('2025-01-02T11:00:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 9 },
      update: {},
      create: {
        sessionId: session2_1.id,
        startTime: new Date('2025-01-02T11:00:00'),
        endTime: new Date('2025-01-02T12:00:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 10 },
      update: {},
      create: {
        sessionId: session2_1.id,
        startTime: new Date('2025-01-02T13:00:00'),
        endTime: new Date('2025-01-02T14:00:00'),
        capacity: 1,
      },
    }),
  ]);

  // Time slots for session 2_2
  const slots2_2 = await Promise.all([
    prisma.timeSlot.upsert({
      where: { id: 11 },
      update: {},
      create: {
        sessionId: session2_2.id,
        startTime: new Date('2025-01-05T09:00:00'),
        endTime: new Date('2025-01-05T10:00:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 12 },
      update: {},
      create: {
        sessionId: session2_2.id,
        startTime: new Date('2025-01-05T10:00:00'),
        endTime: new Date('2025-01-05T11:00:00'),
        capacity: 1,
      },
    }),
  ]);

  // Bookings for study 2 (täynnä!)
  await Promise.all([
    prisma.booking.upsert({
      where: { id: 4 },
      update: {},
      create: {
        slotId: slots2_1[0].id,
        name: 'Sanna Mäkinen',
        email: 'sanna@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 5 },
      update: {},
      create: {
        slotId: slots2_1[1].id,
        name: 'Juha Laine',
        email: 'juha@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 6 },
      update: {},
      create: {
        slotId: slots2_1[2].id,
        name: 'Tiina Heikkinen',
        email: 'tiina@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 7 },
      update: {},
      create: {
        slotId: slots2_2[0].id,
        name: 'Mikko Järvinen',
        email: 'mikko@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 8 },
      update: {},
      create: {
        slotId: slots2_2[1].id,
        name: 'Elina Rantanen',
        email: 'elina@example.com',
        consentAt: new Date(),
      },
    }),
  ]);

  // ============================================
  // STUDY 3: Haastattelututkimus
  // ============================================
  const study3 = await prisma.study.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Käyttäjähaastattelut - Oppimissovellus',
      description: 'Haastattelemme opiskelijoita heidän kokemuksistaan uuden oppimissovelluksen käytöstä. Haastattelu kestää noin 45 minuuttia.',
      ownerId: researcher.id,
    },
  });
  console.log('Created study:', study3.title);

  // Study 3, Session 1
  const session3_1 = await prisma.session.upsert({
    where: { id: 5 },
    update: {},
    create: {
      studyId: study3.id,
      location: 'Teams-etähaastattelu',
      date: new Date('2025-01-03'),
    },
  });

  // Time slots for session 3_1
  await Promise.all([
    prisma.timeSlot.upsert({
      where: { id: 13 },
      update: {},
      create: {
        sessionId: session3_1.id,
        startTime: new Date('2025-01-03T09:00:00'),
        endTime: new Date('2025-01-03T09:45:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 14 },
      update: {},
      create: {
        sessionId: session3_1.id,
        startTime: new Date('2025-01-03T10:00:00'),
        endTime: new Date('2025-01-03T10:45:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 15 },
      update: {},
      create: {
        sessionId: session3_1.id,
        startTime: new Date('2025-01-03T11:00:00'),
        endTime: new Date('2025-01-03T11:45:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 16 },
      update: {},
      create: {
        sessionId: session3_1.id,
        startTime: new Date('2025-01-03T13:00:00'),
        endTime: new Date('2025-01-03T13:45:00'),
        capacity: 1,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 17 },
      update: {},
      create: {
        sessionId: session3_1.id,
        startTime: new Date('2025-01-03T14:00:00'),
        endTime: new Date('2025-01-03T14:45:00'),
        capacity: 1,
      },
    }),
  ]);

  // ============================================
  // STUDY 4: Ryhmätutkimus (Anna Tutkija)
  // ============================================
  const study4 = await prisma.study.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: 'Fokusryhmäkeskustelut',
      description: 'Ryhmäkeskusteluja aiheesta "Digitaalisten palveluiden saavutettavuus". Kussakin ryhmässä 4-6 osallistujaa.',
      ownerId: researcher2.id,
    },
  });
  console.log('Created study:', study4.title);

  // Study 4, Session 1 (ryhmässä useampi henkilö)
  const session4_1 = await prisma.session.upsert({
    where: { id: 6 },
    update: {},
    create: {
      studyId: study4.id,
      location: 'Neuvotteluhuone 1, Päärakennus',
      date: new Date('2025-01-06'),
    },
  });

  // Time slots for session 4_1 (isompi kapasiteetti)
  const slots4_1 = await Promise.all([
    prisma.timeSlot.upsert({
      where: { id: 18 },
      update: {},
      create: {
        sessionId: session4_1.id,
        startTime: new Date('2025-01-06T10:00:00'),
        endTime: new Date('2025-01-06T12:00:00'),
        capacity: 6,
      },
    }),
    prisma.timeSlot.upsert({
      where: { id: 19 },
      update: {},
      create: {
        sessionId: session4_1.id,
        startTime: new Date('2025-01-06T13:00:00'),
        endTime: new Date('2025-01-06T15:00:00'),
        capacity: 6,
      },
    }),
  ]);

  // Bookings for study 4
  await Promise.all([
    prisma.booking.upsert({
      where: { id: 9 },
      update: {},
      create: {
        slotId: slots4_1[0].id,
        name: 'Kaisa Nieminen',
        email: 'kaisa@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 10 },
      update: {},
      create: {
        slotId: slots4_1[0].id,
        name: 'Tero Salminen',
        email: 'tero@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 11 },
      update: {},
      create: {
        slotId: slots4_1[0].id,
        name: 'Hanna Koivisto',
        email: 'hanna@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 12 },
      update: {},
      create: {
        slotId: slots4_1[0].id,
        name: 'Ville Lehtonen',
        email: 'ville@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 13 },
      update: {},
      create: {
        slotId: slots4_1[1].id,
        name: 'Maria Koskinen',
        email: 'maria@example.com',
        consentAt: new Date(),
      },
    }),
    prisma.booking.upsert({
      where: { id: 14 },
      update: {},
      create: {
        slotId: slots4_1[1].id,
        name: 'Antti Lahtinen',
        email: 'antti@example.com',
        consentAt: new Date(),
      },
    }),
  ]);

  console.log('Created 4 studies with sessions, time slots, and bookings');
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
