import Logger from './core/Logger';
import { port } from './config';
import httpServer from './httpServer';
import { runSocketServer } from './socketServer';

httpServer
  .listen(port, () => {
    runSocketServer();
    Logger.info({ env: process.env });
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => {
    Logger.error(e);
  });
