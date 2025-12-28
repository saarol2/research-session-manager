import { FastifyInstance } from 'fastify';
import * as studyService from '../services/studyService.js';

export default async function studyRoutes(server: FastifyInstance) {
  // GET /studies - Get all studies
  server.get('/', async () => {
    return studyService.getAllStudies();
  });

  // GET /studies/:id - Get a single study
  server.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const study = await studyService.getStudyById(id);
    
    if (!study) {
      return reply.status(404).send({ error: 'Study not found' });
    }
    return study;
  });

  // POST /studies - Create a new study
  server.post<{
    Body: { title: string; description?: string };
  }>('/', async (request, reply) => {
    const { title, description } = request.body;
    
    if (!title) {
      return reply.status(400).send({ error: 'Title is required' });
    }
    
    const study = await studyService.createStudy({ title, description });
    return reply.status(201).send(study);
  });

  // PUT /studies/:id - Update a study
  server.put<{
    Params: { id: string };
    Body: { title?: string; description?: string };
  }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    const { title, description } = request.body;
    
    try {
      const study = await studyService.updateStudy(id, { title, description });
      return study;
    } catch {
      return reply.status(404).send({ error: 'Study not found' });
    }
  });

  // DELETE /studies/:id - Delete a study
  server.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const id = parseInt(request.params.id);
    
    try {
      await studyService.deleteStudy(id);
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: 'Study not found' });
    }
  });
}
