import { Socket, io } from 'socket.io-client';
import socketRequest from '../../../src/helpers/socketRequest';
import socketServer from '../../../src/socketServer';
import { runHttpServer, runSocketServer } from '../../../src/runServer';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../src/types/socket';
import httpServer from '../../../src/httpServer';
import { connectMongo, connection } from '../../../src/database';
import Logger from '../../../src/core/Logger';
import {
  cleanUpSocketServer,
  getSocketInstance,
  setupTestedSocketServer,
} from '../utils';

describe('Socket test', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    setupTestedSocketServer();
  });

  afterAll(async () => {
    cleanUpSocketServer();
  });

  beforeEach(async () => {
    clientSocket = await getSocketInstance();
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('Should return data if data is {text: "OK"}', async () => {
    clientSocket.emit(SocketClientMessage.PING, { text: 'OK' });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.RESPONSE, (d) => {
        resolve(d);
      });
      clientSocket.on('error', (d) => {
        resolve(d);
      });
    });
    console.log({ response });
    expect(response.status).toBe(200);
    expect(response.data.text).toBe('Yes');
  });

  test('Should send error if data is invalid', async () => {
    clientSocket.emit(SocketClientMessage.PING, { text: 'not-OK' });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.RESPONSE, (d) => {
        resolve(d);
      });
    });
    expect(response.status).toBe(400);
  });
});
