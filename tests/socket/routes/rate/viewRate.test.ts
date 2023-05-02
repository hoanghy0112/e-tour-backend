import { Socket } from 'socket.io-client';
import { Types } from 'mongoose';
import {
  cleanUpSocketServer,
  getSocketInstance,
  setupTestedSocketServer,
} from '../../utils';
import TouristsRouteModel from '../../../../src/database/model/Company/TouristsRoute';
import TourModel, {
  TourType,
} from '../../../../src/database/model/Company/Tour';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../../src/types/socket';
import socketRequest from '../../../../src/helpers/socketRequest';
import TicketModel, {
  ITicket,
  PaymentStatus,
} from '../../../../src/database/model/User/Ticket';
import RateModel, { RateType } from '../../../../src/database/model/User/Rate';

describe('View rate of route', () => {
  let clientSocket: Socket;
  let tourId: Types.ObjectId;
  let routeId: Types.ObjectId;
  let userId: string;
  let ticketId: string;

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
    const socketInstance = await getSocketInstance('client');
    clientSocket = socketInstance.socket;
    userId = socketInstance.id;

    const ticket = await TicketModel.create({
      tourId,
      phoneNumber: "000000",
      status: PaymentStatus.PENDING,
      visitors: [
        {
          name: 'Hoang Hy',
          age: 19,
        },
      ],
      price: 100_000,
    });

    const rate = await RateModel.create({
      star: 8,
      description: 'Good good',
      userId,
      rateType: RateType.ROUTE,
      touristsRouteId: routeId,
    });

    ticketId = ticket._id.toString();
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('view rate of route', async () => {
    clientSocket.emit(SocketClientMessage.VIEW_RATE_OF_ROUTE, { id: routeId });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.RATE_OF_ROUTE, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.status).toBe(200);
    expect(response.data.length).toBe(1);
  });
});
