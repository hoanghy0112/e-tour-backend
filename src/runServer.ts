import Logger from './core/Logger';
import { port } from './config';
import httpServer from './httpServer';

import socketRouter from './routes/socket';
import io from './socketServer';

export function runSocketServer(): Promise<any> {
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
        reject();
      });
  });
}
