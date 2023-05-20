import { Server } from 'socket.io';
import server from './httpServer';

const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  path: '/socket/',
  cors: {
    credentials: true,
    origin: true,
  },
});

export default io;
