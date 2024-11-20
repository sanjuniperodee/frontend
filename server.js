import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createApp() {
  const app = express();
  const httpServer = createServer(app);

  // Setup Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Setup Vite in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);

  // Enable CORS
  app.use(cors());

  // Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    // Handle moderation events
    socket.on('moderation:action', (data) => {
      io.emit('moderation:action', data);
    });

    socket.on('moderation:auto', (data) => {
      io.emit('moderation:auto', data);
    });

    // Handle reputation events
    socket.on('reputation:update', (data) => {
      io.emit('reputation:update', data);
    });

    // Handle marker events
    socket.on('marker:created', (data) => {
      io.emit('marker:created', data);
    });

    socket.on('marker:updated', (data) => {
      io.emit('marker:updated', data);
    });

    socket.on('marker:deleted', (data) => {
      io.emit('marker:deleted', data);
    });
  });

  // Start server
  const port = process.env.PORT || 5173;
  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

createApp().catch(console.error);