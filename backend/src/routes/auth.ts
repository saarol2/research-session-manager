import { FastifyInstance } from 'fastify';
import * as authService from '../services/authService.js';

export default async function authRoutes(server: FastifyInstance) {
  // POST /auth/register - Register
  server.post<{
    Body: { email: string; password: string; name: string };
  }>('/register', async (request, reply) => {
    const { email, password, name } = request.body;

    if (!email || !password || !name) {
      return reply.status(400).send({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return reply.status(400).send({ error: 'Password must be at least 6 characters' });
    }

    try {
      const user = await authService.register({ email, password, name });
      const token = server.jwt.sign({ id: user.id, email: user.email, role: user.role });

      return reply.status(201).send({
        user,
        token,
      });
    } catch (error) {
      server.log.error(error, 'Registration error');
      if (error instanceof Error && error.message === 'User already exists') {
        return reply.status(409).send({ error: 'User already exists' });
      }
      return reply.status(500).send({ error: 'Registration failed' });
    }
  });

  // POST /auth/login - Log in
  server.post<{
    Body: { email: string; password: string };
  }>('/login', async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    try {
      const user = await authService.login({ email, password });
      const token = server.jwt.sign({ id: user.id, email: user.email, role: user.role });

      return {
        user,
        token,
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }
      return reply.status(500).send({ error: 'Login failed' });
    }
  });

  // GET /auth/me - Get current user
  server.get('/me', {
    preHandler: [server.authenticate],
  }, async (request, reply) => {
    const user = await authService.getUserById(request.user.id);

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return user;
  });
}
