import { Socket, io } from 'socket.io-client';
import socketRequest from '../../../src/helpers/socketRequest';
import socketServer from '../../../src/socketServer';
import { runHttpServer, runSocketServer } from '../../../src/runServer';
import {
  SocketClientEvent,
  SocketServerEvent,
} from '../../../src/types/socket';

describe('Socket test', () => {
  let clientSocket: Socket;

  beforeAll(() => {
    runHttpServer();
    runSocketServer();
    clientSocket = io(`http://localhost`, { path: '/socket' });
    // clientSocket.on('connect', done);
  }, 15000);

  afterAll(async () => {
    socketServer.close();
    clientSocket.close();
  });

  test('Should return data if data is {text: "OK"}', async () => {
    clientSocket.emit(SocketClientEvent.PING, { text: 'OK' });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerEvent.RESPONSE, (d) => {
        resolve(d);
      });
    });

    expect(response.status).toBe(200);
    expect(response.data.text).toBe('Yes');
  }, 15000);

  test('Should send error if data is invalid', async () => {
    clientSocket.emit(SocketClientEvent.PING, { text: 'not-OK' });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerEvent.RESPONSE, (d) => {
        resolve(d);
      });
    });

    expect(response.status).toBe(400);
  }, 15000);
});
