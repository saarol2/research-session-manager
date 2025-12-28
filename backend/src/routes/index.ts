import { FastifyInstance } from 'fastify';
import studyRoutes from './studies.js';
import sessionRoutes from './sessions.js';
import bookingRoutes from './bookings.js';
import timeSlotRoutes from './timeslots.js';

export async function registerRoutes(server: FastifyInstance) {
  await server.register(studyRoutes, { prefix: '/studies' });
  await server.register(sessionRoutes, { prefix: '/sessions' });
  await server.register(bookingRoutes, { prefix: '/bookings' });
  await server.register(timeSlotRoutes, { prefix: '/timeslots' });
}
