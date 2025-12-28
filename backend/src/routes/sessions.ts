import { FastifyInstance } from 'fastify';
import * as sessionService from '../services/sessionService.js';

export default async function sessionRoutes(server: FastifyInstance) {
  // GET /sessions - Get all sessions
  server.get('/', async () => {
    return sessionService.getAllSessions();
  });

  // GET /sessions/:id - Get a single session
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const session = await sessionService.getSessionById(id);
    
    if (!session) {
      return reply.status(404).send({ error: 'Session not found' });
    }
    return session;
  });

  // GET /sessions/study/:studyId - Get sessions by study
  server.get<{ Params: { studyId: string } }>('/study/:studyId', async (request) => {
    const studyId = parseInt(request.params.studyId);
    return sessionService.getSessionsByStudyId(studyId);
  });

  // POST /sessions - Create a new session
  server.post<{
    Body: {
      studyId: number;
      location: string;
      date: string;
    };
  }>('/', async (request, reply) => {
    const { studyId, location, date } = request.body;
    
    if (!studyId || !location || !date) {
      return reply.status(400).send({ error: 'studyId, location and date are required' });
    }
    
    try {
      const session = await sessionService.createSession({
        studyId,
        location,
        date: new Date(date),
      });
      return reply.status(201).send(session);
    } catch {
      return reply.status(400).send({ error: 'Failed to create session' });
    }
  });

  // DELETE /sessions/:id - Delete a session
  server.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    
    try {
      await sessionService.deleteSession(id);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'Session not found' });
    }
  });
}
