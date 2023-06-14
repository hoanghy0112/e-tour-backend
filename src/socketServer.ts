import { Server } from 'socket.io';
import server from './httpServer';
import { instrument } from '@socket.io/admin-ui';

const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  path: '/socket/',
  cors: {
    credentials: true,
    origin: true,
  },
});

instrument(io, {
  namespaceName: '/admin',
  auth: false,
});

export default io;
