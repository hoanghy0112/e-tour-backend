import Logger from './core/Logger';
import { port } from './config';
import httpServer from './httpServer';

import socketRouter from './routes/socket';
import io from './socketServer';

export function runSocketServer() {
  io.on('connection', async (socket) => {
    Logger.debug('New connection');

    socketRouter(socket);
  });
}

export function runHttpServer() {
  httpServer
    .listen(port, () => {
      Logger.info(`server running on port : ${port}`);
    })
    .on('error', (e) => {
      Logger.error(e);
    });
}
