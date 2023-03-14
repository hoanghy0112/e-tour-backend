import { Socket, io } from 'socket.io-client';
import socketRequest from '../../../src/helpers/socketRequest';
import {
  SocketClientEvent,
  SocketServerEvent,
} from '../../../src/types/socket';

describe('Socket test', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    clientSocket = io(`http://localhost:80`, { path: '/socket' });
  });

  afterAll(async () => {
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
  });

  test('Should send error if data is invalid', async () => {
    clientSocket.emit(SocketClientEvent.PING, { text: 'not-OK' });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerEvent.RESPONSE, (d) => {
        console.log({ res: d });
        resolve(d);
      });
    });

    console.log({ response });
    expect(response.status).toBe(400);
  });
});
