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
import {
  ITicket,
  PaymentStatus,
} from '../../../../src/database/model/User/Ticket';

describe('Book new ticket', () => {
  let clientSocket: Socket;
  let tourId: Types.ObjectId;
  let routeId: Types.ObjectId;
  let userId: string;

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
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('Book new ticket', async () => {
    clientSocket.emit(SocketClientMessage.BOOK_TICKET, {
      ticketInfo: {
        userId,
        tourId,
        status: PaymentStatus.PENDING,
        visitors: [
          {
            name: 'Hoang Hy',
            age: 19,
          },
        ],
      },
    } as { ticketInfo: ITicket; voucherIds?: string[] });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.BOOKED_TICKET, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.data.tourId).toBe(tourId.toString());
  });
});
