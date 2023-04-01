import { connectMongo } from './database';
import { runHttpServer, runSocketServer } from './runServer';

async function startServer() {
  await connectMongo();
  await runSocketServer();
  await runHttpServer();
}

startServer();
