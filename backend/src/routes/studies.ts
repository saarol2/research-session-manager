import { FastifyInstance } from 'fastify';
import * as studyService from '../services/studyService.js';

export default async function studyRoutes(server: FastifyInstance) {
  // GET /studies - Get all studies (public)
  server.get('/', async () => {
    return studyService.getAllStudies();
  });

  // GET /studies/my - Get studies owned by the logged-in user (protected)
  server.get('/my', {
    preHandler: [server.authenticate],
  }, async (request) => {
    return studyService.getStudiesByOwnerId(request.user.id);
  });

  // GET /studies/:id - Get a single study (public)
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const study = await studyService.getStudyById(id);

    if (!study) {
      return reply.status(404).send({ error: 'Study not found' });
    }
    return study;
  });

  // POST /studies - Create a new study (protected)
  server.post<{
    Body: { title: string; description?: string };
  }>('/', {
    preHandler: [server.authenticate],
  }, async (request, reply) => {
    const { title, description } = request.body;

    if (!title) {
      return reply.status(400).send({ error: 'Title is required' });
    }

    const study = await studyService.createStudy({
      title,
      description,
      ownerId: request.user.id,
    });
    return reply.status(201).send(study);
  });

  // PUT /studies/:id - Update a study (protected, owner only)
  server.put<{
    Params: { id: string };
    Body: { title?: string; description?: string };
  }>('/:id', {
    preHandler: [server.authenticate],
  }, async (request, reply) => {
    const id = parseInt(request.params.id);
    const { title, description } = request.body;

    // Check ownership
    const study = await studyService.getStudyById(id);
    if (!study) {
      return reply.status(404).send({ error: 'Study not found' });
    }
    if (study.ownerId !== request.user.id) {
      return reply.status(403).send({ error: 'Not authorized to update this study' });
    }

    try {
      const updatedStudy = await studyService.updateStudy(id, { title, description });
      return updatedStudy;
    } catch {
      return reply.status(500).send({ error: 'Update failed' });
    }
  });

  // DELETE /studies/:id - Delete a study (protected, owner only)
  server.delete<{ Params: { id: string } }>('/:id', {
    preHandler: [server.authenticate],
  }, async (request, reply) => {
    const id = parseInt(request.params.id);

    // Check ownership
    const study = await studyService.getStudyById(id);
    if (!study) {
      return reply.status(404).send({ error: 'Study not found' });
    }
    if (study.ownerId !== request.user.id) {
      return reply.status(403).send({ error: 'Not authorized to delete this study' });
    }

    try {
      await studyService.deleteStudy(id);
      return reply.status(204).send();
    } catch {
      return reply.status(500).send({ error: 'Delete failed' });
    }
  });
}
