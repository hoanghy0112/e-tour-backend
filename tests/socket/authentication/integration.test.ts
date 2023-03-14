import { Socket, io } from 'socket.io-client';

describe('Authentication in socket', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    clientSocket = io(`http://localhost:80`, { path: '/socket' });
  });

  afterAll(async () => {
    clientSocket.close();
  });

  test('Should send error if Authorization not found', () => {
    //
  });
});
