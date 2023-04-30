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

describe('View staff information', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    setupTestedSocketServer();
  });

  afterAll(async () => {
    cleanUpSocketServer();
  });

  beforeEach(async () => {
    clientSocket = (await getSocketInstance('staff')).socket;
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('Should view successfully', async () => {
    clientSocket.emit(SocketClientMessage.VIEW_STAFF_INFO);
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.STAFF_INFO, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.data.fullName).toBe('Administrator');
  });
});
