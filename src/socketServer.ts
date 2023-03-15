import { Server } from 'socket.io';
import server from './httpServer';
import { SocketServerMessage } from './types/socket';
import { socketErrorHandler } from './helpers/socketAsyncHandler';
import { BadRequestError } from './core/ApiError';
import { authenticateStaff, authenticateUser } from './auth/authentication';

const io = new Server(server, {
  path: '/socket/',
  cors: {
    credentials: true,
    origin: true,
  },
});

io.use(async (socket, next) => {
  const token = (socket.handshake.query.token as string) || '';
  const userType = (socket.handshake.query.type as string) || ''; // client or staff

  switch (userType) {
    case 'client':
      const { user } = await authenticateUser(token);
      socket.data.user = user;
      break;
    case 'staff':
      const { staff } = await authenticateStaff(token);
      socket.data.staff = staff;
      break;
    default:
      next(
        new BadRequestError(
          'userType is invalid (only "client" or "staff" is allowed',
        ),
      );
  }

  next();
});

export default io;
