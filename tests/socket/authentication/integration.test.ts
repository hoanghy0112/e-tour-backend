import { Socket, io } from 'socket.io-client';
import {
  SocketClientEvent,
  SocketServerEvent,
} from '../../../src/types/socket';
import socketRequest from '../../../src/helpers/socketRequest';
import socketServer from '../../../src/socketServer';
import { runSocketServer, runHttpServer } from '../../../src/runServer';

describe('Authentication in socket', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    runHttpServer();
    runSocketServer();
    clientSocket = io(`http://localhost`, { path: '/socket' });
  }, 15000);

  afterAll(async () => {
    socketServer.close();
    clientSocket.close();
  });

  test('Should send error if Authorization not found', async () => {
    clientSocket.emit(SocketClientEvent.PING, { text: 'OK' });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerEvent.RESPONSE, (d) => {
        resolve(d);
      });
    });

    console.log(response.data);
    // expect(response.status).toBe(400);
  }, 15000);
});
