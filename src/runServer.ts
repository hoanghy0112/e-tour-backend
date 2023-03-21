import Logger from './core/Logger';
import { port } from './config';
import httpServer from './httpServer';

import socketRouter from './routes/socket';
import io from './socketServer';
import { authenticateStaff, authenticateUser } from './auth/authentication';
import { BadRequestError } from './core/ApiError';
import WatchTable from './helpers/realtime/WatchTable';
import UserModel from './database/model/User/User';

export function runSocketServer(): Promise<any> {
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

  return new Promise((resolve, reject) => {
    io.on('connection', async (socket) => {
      Logger.debug('New connection');

      socketRouter(socket);
    });
    resolve('Socket IO server is running');
  });
}

export function runHttpServer(): Promise<any> {
  return new Promise((resolve, reject) => {
    httpServer
      .listen(port, () => {
        Logger.info(`server running on port : ${port}`);
        resolve('Http server is running');
      })
      .on('error', (e) => {
        Logger.error(e);
        reject(e);
      });
  });
}
