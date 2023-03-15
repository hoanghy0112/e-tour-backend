import { Server } from 'socket.io';
import server from './httpServer';

const io = new Server(server, {
  path: '/socket/',
  cors: {
    credentials: true,
    origin: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const userType = socket.handshake.query.type; // client or staff

  socket.data = {
    token,
    userType,
  };

  next();
});

export default io;
