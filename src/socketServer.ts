import { Server } from 'socket.io';
import server from './httpServer';
import { SocketServerMessage } from './types/socket';
import { socketErrorHandler } from './helpers/socketAsyncHandler';
import { BadRequestError } from './core/ApiError';

const io = new Server(server, {
  path: '/socket/',
  cors: {
    credentials: true,
    origin: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.query.token || '';
  const userType = (socket.handshake.query.type as string) || ''; // client or staff

  if (!['client', 'staff'].includes(userType)) {
    const error = new BadRequestError(
      'userType is invalid (only "client" or "staff" is allowed',
    );

    next(error);
  }

  socket.data.auth = {
    token,
    userType,
  };

  next();
});

export default io;
