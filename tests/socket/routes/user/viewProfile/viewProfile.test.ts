import { Socket } from 'socket.io-client';
import {
  cleanUpSocketServer,
  getSocketInstance,
  setupTestedSocketServer,
} from '../../../utils';
import TouristsRouteModel from '../../../../../src/database/model/Company/TouristsRoute';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../../../src/types/socket';
import socketRequest from '../../../../../src/helpers/socketRequest';
import { Types } from 'mongoose';
import UserModel from '../../../../../src/database/model/User/User';

describe('View user profile', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    setupTestedSocketServer();
  });

  afterAll(async () => {
    cleanUpSocketServer();
  });

  beforeEach(async () => {
    clientSocket = (await getSocketInstance('client')).socket;
  });

  afterEach(() => {
    clientSocket.close();
  });

  async function getResponse() {
    return socketRequest((resolve) => {
      clientSocket.on(SocketServerMessage.USER_PROFILE, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });
  }

  test('Valid user', async () => {
    clientSocket.emit(SocketClientMessage.VIEW_USER_PROFILE);

    const response = await getResponse();

    expect(response.status).toBe(200);
    expect(response.data.fullName).toBe('full name');
    expect(response.data.email).toBe('email@gmail.com');
    expect(response.data.identity).toBe('00000000');
  });

  test('Invalid user', async () => {
    clientSocket = (await getSocketInstance('staff')).socket;

    clientSocket.emit(SocketClientMessage.VIEW_USER_PROFILE);
    const response = await getResponse();

    expect(response.status).toBe(400);
  });
});
