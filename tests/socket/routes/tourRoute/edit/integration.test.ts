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
import { Types } from 'mongoose';

describe('Company edit tour route', () => {
  let clientSocket: Socket;
  let routeId: Types.ObjectId;

  beforeAll(async () => {
    setupTestedSocketServer();
    await TouristsRouteModel.deleteMany({});
    const route = await TouristsRouteModel.create({
      reservationFee: 5,
      name: 'First vacation',
      description: 'Lorem ipsum',
      route: ['Sai Gon', 'Tay Son'],
      companyId: '6406e44a7144bb633674d32e',
    });
    routeId = route._id;
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

  test('Company edit tour route with companyId', async () => {
    clientSocket.emit(SocketClientMessage.EDIT_ROUTE, {
      _id: routeId,
      companyId: '6406e44a7144bb633674d32e',
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.EDIT_ROUTE_RESULT, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });

    expect(response.status).toBe(400);
  });

  test('Company edit tour route successfully', async () => {
    clientSocket.emit(SocketClientMessage.EDIT_ROUTE, {
      _id: routeId.toString(),
      reservationFee: 10,
      name: 'Update',
      description: 'Des',
      route: ['Sai Gon', 'Ha Noi'],
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.EDIT_ROUTE_RESULT, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.status).toBe(200);
    expect(response.data.name).toBe('Update');
    expect(response.data.reservationFee).toBe(10);
    expect(response.data.description).toBe('Des');
    expect(response.data.route).toStrictEqual(['Sai Gon', 'Ha Noi']);
  });
});
