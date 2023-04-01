import { connectMongo } from './database';
import { runHttpServer, runSocketServer } from './runServer';

async function startServer() {
  await connectMongo();
  runSocketServer();
  runHttpServer();
}

startServer();
