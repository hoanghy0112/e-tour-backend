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

  // authentication here

  next();
});

export function runSocketServer() {
  io.on('connection', async (socket) => {
    socketRouter(socket);

    // Error handler
    socket.on('connect_error', async (err) => {
      if (err instanceof ApiError) {
        ApiError.handleSocket(err, socket);
        if (err.type === ErrorType.INTERNAL)
          Logger.error(
            `500 - ${err.name} - ${err.type} - ${err.message} - ${err.stack}`,
          );
      } else {
        Logger.error(
          `500 - ${err.name} - ${err.type} - ${err.message} - ${err.stack}`,
        );
        Logger.error(err);
        if (environment === 'development') {
          socket.emit('error', err);
        }
        ApiError.handleSocket(new InternalError(), socket);
      }
    });
  });
}

// Error handler

export default io;
