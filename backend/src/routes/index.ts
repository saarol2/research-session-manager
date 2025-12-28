import { FastifyInstance } from 'fastify';
import authRoutes from './auth.js';
import studyRoutes from './studies.js';
import sessionRoutes from './sessions.js';
import bookingRoutes from './bookings.js';
import timeSlotRoutes from './timeslots.js';

export async function registerRoutes(server: FastifyInstance) {
  // Health check
  server.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Auth (public)
  await server.register(authRoutes, { prefix: '/api/auth' });

  // API routes
  await server.register(studyRoutes, { prefix: '/api/studies' });
  await server.register(sessionRoutes, { prefix: '/api/sessions' });
  await server.register(bookingRoutes, { prefix: '/api/bookings' });
  await server.register(timeSlotRoutes, { prefix: '/api/timeslots' });
}
