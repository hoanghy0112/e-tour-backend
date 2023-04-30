import { Types } from 'mongoose';
import { Socket } from 'socket.io-client';
import TourModel, {
  TourType,
} from '../../../../src/database/model/Company/Tour';
import TouristsRouteModel from '../../../../src/database/model/Company/TouristsRoute';
import TicketModel, {
  PaymentStatus
} from '../../../../src/database/model/User/Ticket';
import socketRequest from '../../../../src/helpers/socketRequest';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../../src/types/socket';
import {
  cleanUpSocketServer,
  getSocketInstance,
  setupTestedSocketServer,
} from '../../utils';

describe('Create new rate', () => {
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
      userId,
      tourId,
      status: PaymentStatus.PENDING,
      visitors: [
        {
          name: 'Hoang Hy',
          age: 19,
        },
      ],
      price: 100_000,
    });

    ticketId = ticket._id.toString();
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('Create new rate', async () => {
    clientSocket.emit(SocketClientMessage.CREATE_RATE, {
      star: 8,
      description: 'Good good',
      touristsRouteId: routeId,
    });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.CREATE_RATE_RESULT, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.status).toBe(200);
    expect(response.data.star).toBe(8);
  });
});
