import { Socket, io } from 'socket.io-client';
import socketRequest from '../../../src/helpers/socketRequest';
import socketServer from '../../../src/socketServer';
import { runHttpServer, runSocketServer } from '../../../src/runServer';
import {
  SocketClientEvent,
  SocketServerEvent,
} from '../../../src/types/socket';
import httpServer from '../../../src/httpServer';

describe('Socket test', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    // await runSocketServer();
    // await runHttpServer();
    // clientSocket = io(`http://localhost`, { path: '/socket' });
    // // await new Promise((resolve) => {
    // //   clientSocket.on('connect', () => resolve(''));
    // // });
    // clientSocket.on('connect', () => {

    // });
  });

  afterAll(async () => {
    // socketServer.close();
    // httpServer.close();
  });

  test('Should return data if data is {text: "OK"}', async () => {
    // clientSocket.emit(SocketClientEvent.PING, { text: 'OK' });
    // const response = await socketRequest((resolve, reject) => {
    //   clientSocket.on(SocketServerEvent.RESPONSE, (d) => {
    //     resolve(d);
    //   });
    // });

    // expect(response.status).toBe(200);
    // expect(response.data.text).toBe('Yes');
  });

  test('Should send error if data is invalid', async () => {
    // clientSocket.emit(SocketClientEvent.PING, { text: 'not-OK' });
    // const response = await socketRequest((resolve, reject) => {
    //   clientSocket.on(SocketServerEvent.RESPONSE, (d) => {
    //     resolve(d);
    //   });
    // });

    // expect(response.status).toBe(400);
  });
});
