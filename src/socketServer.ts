import { Server } from 'socket.io';
import server from './httpServer';
import { ApiError, ErrorType, InternalError } from './core/ApiError';
import Logger from './core/Logger';
import { environment } from './config';
import socketRouter from './routes/socket';

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
