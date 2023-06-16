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

describe('View tour by filter', () => {
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

  test.each([
    {
      getTouristRoute: () => routeId,
      check: (response: any) => {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(1);
      },
    },
    {
      getTouristRoute: () => 'some-thing-else',
      check: (response: any) => {
        expect(response.status).toEqual(500);
      },
    },
  ])('Filter by tourist route', async ({ getTouristRoute, check }) => {
    clientSocket.emit(SocketClientMessage.FILTER_TOUR, {
      touristRoute: getTouristRoute(),
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.LIST_TOUR, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });

    check(response);
  });

  test.each([
    {
      from: new Date(new Date().getTime() - 10000),
      to: new Date(new Date().getTime() + 10000),
      count: 1,
    },
    { from: new Date(), to: new Date(), count: 0 },
  ])('Filter by date', async ({ from, to, count }) => {
    clientSocket.emit(SocketClientMessage.FILTER_TOUR, {
      from,
      to,
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.LIST_TOUR, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });

    expect(response.data.length).toEqual(count);
  });
});
