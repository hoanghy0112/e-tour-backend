import { Socket } from 'socket.io-client';
import {
  cleanUpSocketServer,
  getSocketInstance,
  setupTestedSocketServer,
} from '../../../utils';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../../../src/types/socket';
import socketRequest from '../../../../../src/helpers/socketRequest';

describe('View company information', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    setupTestedSocketServer();
  });

  afterAll(async () => {
    cleanUpSocketServer();
  });

  beforeEach(async () => {
    clientSocket = await getSocketInstance('staff');
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('Should view successfully', async () => {
    clientSocket.emit(SocketClientMessage.VIEW_COMPANY_INFO);
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.COMPANY_INFO, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.data.name).toBe('congty');
    expect(response.data.email).toBe('congty@gmail.com');
  });
});
