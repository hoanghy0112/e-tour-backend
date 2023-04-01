import { connectMongo, connection } from '../../src/database';
import { runHttpServer, runSocketServer } from '../../src/runServer';
import { Socket, io } from 'socket.io-client';
import socketServer from '../../src/socketServer';
import httpServer from '../../src/httpServer';

export async function setupTestedSocketServer() {
  await connectMongo();
  await runSocketServer();
  await runHttpServer();
}

export async function cleanUpSocketServer() {
  connection.close();
  socketServer.close();
  httpServer.close();
}

export async function getSocketInstance(): Promise<Socket> {
  const clientSocket = io(`http://localhost:3000`, { path: '/socket' });

  await new Promise<void>((resolve) => {
    clientSocket.on('connect', () => resolve());
  });

  return clientSocket;
}
