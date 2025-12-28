import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { registerRoutes } from './routes/index.js';
import { authMiddleware } from './middleware/auth.js';

const server = Fastify({ logger: true });

// CORS
await server.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
});

// JWT
await server.register(jwt, {
  secret: process.env.JWT_SECRET || 'development-secret-change-in-production',
});

// Auth middleware (authenticate decorator)
await authMiddleware(server);

// Register all routes
await registerRoutes(server);

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
