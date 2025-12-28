import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Role } from '../../prisma/generated/prisma/client.js';

// Add typings for authenticate decorator and JWT payload
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number; email: string; role: Role };
    user: { id: number; email: string; role: Role };
  }
}

export async function authMiddleware(server: FastifyInstance) {
  // Decorator: authenticate function that can be added to routes
  server.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}

// Helper: Check if the user is an admin
export function requireAdmin(request: FastifyRequest, reply: FastifyReply, done: () => void) {
  if (request.user.role !== Role.admin) {
    reply.status(403).send({ error: 'Forbidden: Admin access required' });
    return;
  }
  done();
}
