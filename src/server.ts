import Logger from './core/Logger';
import { port } from './config';
import httpServer from './httpServer';
import io from './socketServer';
import socketRouter from './routes/socket';

function runSocketServer() {
  Logger.info('Run socker server');

  io.on('connection', async (socket) => {
    Logger.debug('New connection');

    socketRouter(socket);
  });
}

runSocketServer();

httpServer
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => {
    Logger.error(e);
  });
