import socketIo from 'socket.io';
import { Server } from 'http';

export const createWebsocket = (server: any): socketIo.Server => {
  const io = socketIo(server);

  io.on('connection', socket => {
    console.log('connected on socket: %s', socket.id);

    socket.on('disconnect', () => console.log('disconected: %s', socket.id));
  });

  return io;
};
