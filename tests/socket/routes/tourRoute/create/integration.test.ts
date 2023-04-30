import { Socket, io } from 'socket.io-client';
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
import TouristsRouteModel from '../../../../../src/database/model/Company/TouristsRoute';

describe('Company create tour route', () => {
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

  test('Company create tour route successfully', async () => {
    await TouristsRouteModel.deleteMany({});

    clientSocket.emit(SocketClientMessage.CREATE_ROUTE, {
      reservationFee: 5,
      name: 'Vacation tour to Tay Son',
      description: 'Lorem ipsum',
      route: ['Sai Gon', 'Tay Son'],
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.CREATE_ROUTE_RESULT, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.status).toBe(200);
    expect(response.data.name).toBe('Vacation tour to Tay Son');
  });
});
