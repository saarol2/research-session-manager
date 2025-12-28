import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './routes/index.js';

const server = Fastify({ logger: true });

// CORS
await server.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
});

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
