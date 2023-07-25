import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

import config from '../../config';

let io: Server | undefined;

export const initializeSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: `${config.frontend.base}`,
    },
  });

  return io;
};

export const getIOInstance = (): Server => {
  if (!io) {
    throw new Error('SocketIO is not initialized');
  }

  return io;
};
