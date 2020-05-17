import socketIo from 'socket.io';
import { Server } from 'http';

export const createWebsocket = (server: Server): socketIo.Server => {
  return socketIo(server);
};
