import 'dotenv/config';
import Fastify from 'fastify';
import { PrismaClient } from '../prisma/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const server = Fastify({ logger: true });

// Health-check
server.get('/health', async () => {
  return { status: 'ok' };
});

// Fetch all sessions
server.get('/sessions', async () => {
  try {
    const sessions = await prisma.session.findMany({
      include: { slots: true }, // include session slots
    });
    return sessions;
  } catch (err) {
    server.log.error(err);
    return { error: 'Failed to fetch sessions' };
  }
});

// Add booking
server.post('/bookings', async (request, reply) => {
  try {
    const { slotId, name, email, consentAt } = request.body as {
      slotId: number;
      name: string;
      email?: string;
      consentAt: string;
    };

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        slotId,
        name,
        email,
        consentAt: new Date(consentAt),
      },
    });

    return booking;
  } catch (err) {
    server.log.error(err);
    reply.status(500).send({ error: 'Booking failed' });
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
