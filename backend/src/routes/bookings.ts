import { FastifyInstance } from 'fastify';
import * as bookingService from '../services/bookingService.js';

export default async function bookingRoutes(server: FastifyInstance) {
  // GET /bookings - Get all bookings
  server.get('/', async () => {
    return bookingService.getAllBookings();
  });

  // GET /bookings/:id - Get a single booking
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const booking = await bookingService.getBookingById(id);
    
    if (!booking) {
      return reply.status(404).send({ error: 'Booking not found' });
    }
    return booking;
  });

  // GET /bookings/slot/:slotId - Get bookings by slot
  server.get<{ Params: { slotId: string } }>('/slot/:slotId', async (request) => {
    const slotId = parseInt(request.params.slotId);
    return bookingService.getBookingsBySlotId(slotId);
  });

  // POST /bookings - Create a new booking
  server.post<{
    Body: {
      slotId: number;
      name: string;
      email?: string;
      consentAt: string;
    };
  }>('/', async (request, reply) => {
    const { slotId, name, email, consentAt } = request.body;
    
    if (!slotId || !name || !consentAt) {
      return reply.status(400).send({ error: 'slotId, name and consentAt are required' });
    }
    
    try {
      const booking = await bookingService.createBooking({
        slotId,
        name,
        email,
        consentAt: new Date(consentAt),
      });
      return reply.status(201).send(booking);
    } catch (error) {
      if (error instanceof Error && error.message === 'Slot is full') {
        return reply.status(409).send({ error: 'Slot is full' });
      }
      return reply.status(400).send({ error: 'Failed to create booking' });
    }
  });

  // DELETE /bookings/:id - Delete a booking
  server.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    
    try {
      await bookingService.deleteBooking(id);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'Booking not found' });
    }
  });
}
