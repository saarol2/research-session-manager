import { FastifyInstance } from 'fastify';
import * as timeSlotService from '../services/timeSlotService.js';

export default async function timeSlotRoutes(server: FastifyInstance) {
  // GET /timeslots - Get all time slots
  server.get('/', async () => {
    return timeSlotService.getAllTimeSlots();
  });

  // GET /timeslots/:id - Get a single time slot
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const slot = await timeSlotService.getTimeSlotWithAvailability(id);

    if (!slot) {
      return reply.status(404).send({ error: 'TimeSlot not found' });
    }
    return slot;
  });

  // GET /timeslots/session/:sessionId - Get time slots for a session
  server.get<{ Params: { sessionId: string } }>(
    '/session/:sessionId',
    async (request) => {
      const sessionId = parseInt(request.params.sessionId);
      return timeSlotService.getTimeSlotsBySessionId(sessionId);
    }
  );

  // POST /timeslots - Create a new time slot
  server.post<{
    Body: {
      sessionId: number;
      startTime: string;
      endTime: string;
      capacity: number;
    };
  }>('/', async (request, reply) => {
    const { sessionId, startTime, endTime, capacity } = request.body;

    if (!sessionId || !startTime || !endTime || !capacity) {
      return reply
        .status(400)
        .send({ error: 'sessionId, startTime, endTime and capacity are required' });
    }

    try {
      const slot = await timeSlotService.createTimeSlot({
        sessionId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity,
      });
      return reply.status(201).send(slot);
    } catch {
      return reply.status(400).send({ error: 'Failed to create timeslot' });
    }
  });

  // PUT /timeslots/:id - Update a time slot
  server.put<{
    Params: { id: string };
    Body: { startTime?: string; endTime?: string; capacity?: number };
  }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const { startTime, endTime, capacity } = request.body;

    try {
      const slot = await timeSlotService.updateTimeSlot(id, {
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        capacity,
      });
      return slot;
    } catch {
      return reply.status(404).send({ error: 'TimeSlot not found' });
    }
  });

  // DELETE /timeslots/:id - Delete a time slot
  server.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);

    try {
      await timeSlotService.deleteTimeSlot(id);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'TimeSlot not found' });
    }
  });
}
