import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';

export function socket(app: INestApplication) {
  app.useWebSocketAdapter(new IoAdapter(app));
  const server = app.getHttpServer();
  const io = new socketio.Server(server);
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
  });
}
