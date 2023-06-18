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
import TourModel, {
  TourType,
} from '../../../../../src/database/model/Company/Tour';

describe('View tour by id', () => {
  let clientSocket: Socket;
  let tourId: Types.ObjectId;
  let routeId: Types.ObjectId;

  beforeAll(async () => {
    setupTestedSocketServer();
    await TouristsRouteModel.deleteMany({});
    await TourModel.deleteMany({});

    const route = await TouristsRouteModel.create({
      reservationFee: 5,
      name: 'First vacation',
      description: 'Lorem ipsum',
      route: ['Sai Gon', 'Tay Son'],
      companyId: '6406e44a7144bb633674d32e',
    });
    const tour = await TourModel.create({
      from: new Date(),
      to: new Date(),
      type: TourType.NORMAL,
      touristRoute: route._id,
    });
    routeId = route._id;
    tourId = tour._id;
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

  test('Valid tour id', async () => {
    clientSocket.emit(SocketClientMessage.VIEW_TOUR, { id: tourId });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.TOUR, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.data.touristRoute).toBe(routeId.toString());
  });

  test.skip('Invalid route id', async () => {
    clientSocket.emit(SocketClientMessage.VIEW_TOUR, { id: 'something else' });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.TOUR, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });

    expect(response.status).toBe(400);
  });
});
