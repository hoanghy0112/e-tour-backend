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

describe('View recommend tourist route', () => {
  let clientSocket: Socket;
  let routeId: Types.ObjectId;

  beforeAll(async () => {
    setupTestedSocketServer();
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
    clientSocket = (await getSocketInstance('client')).socket;
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('Valid num (num < total document of TouristRoute collectoin)', async () => {
    clientSocket.emit(SocketClientMessage.VIEW_RECOMMEND_ROUTE, {
      num: 1,
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.LIST_ROUTE, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });
    console.log(response.data);

    expect(response.status).toBe(200);
    expect(response.data?.[0]?._id.toString()).toBe(routeId.toString());
  });

  test('Invalid num (num > total document of TouristRoute collectoin)', async () => {
    clientSocket.emit(SocketClientMessage.VIEW_RECOMMEND_ROUTE, {
      num: 1,
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.LIST_ROUTE, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });
    console.log(response.data);

    expect(response.status).toBe(200);
    expect(response.data?.length).toBe(1);
    expect(response.data?.[0]?._id.toString()).toBe(routeId.toString());
  });
});
