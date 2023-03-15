import { Server } from 'socket.io';
import server from './httpServer';

const io = new Server(server, {
  path: '/socket/',
  cors: {
    credentials: true,
    origin: true,
  },
});

export default io;
