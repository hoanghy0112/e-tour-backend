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
import TourModel, {
  TourType,
} from '../../../../../src/database/model/Company/Tour';
import { Types } from 'mongoose';
import TouristsRouteModel from '../../../../../src/database/model/Company/TouristsRoute';

describe('Company create tour', () => {
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

  test('Company create tour with invalid touristRoute', async () => {
    await TourModel.deleteMany({});

    const FROM = new Date();
    const TO = new Date();
    const TYPE = TourType.NORMAL;
    const IMAGE = 'https://example.com/image.png';

    clientSocket.emit(SocketClientMessage.CREATE_TOUR, {
      from: FROM,
      to: TO,
      type: TYPE,
      image: IMAGE,
      touristRoute: 'fasf',
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.CREATE_TOUR_RESULT, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });

    expect(response.status).toBe(400);
  });

  test('Company create tour successfully', async () => {
    await TourModel.deleteMany({});

    const FROM = new Date();
    const TO = new Date();
    const TYPE = TourType.NORMAL;
    const IMAGE = 'https://example.com/image.png';

    clientSocket.emit(SocketClientMessage.CREATE_TOUR, {
      from: FROM,
      to: TO,
      type: TYPE,
      image: IMAGE,
      touristRoute: routeId,
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.CREATE_TOUR_RESULT, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });

    expect(response.status).toBe(200);
    expect(new Date(response.data.from).getTime()).toStrictEqual(
      new Date(FROM).getTime(),
    );
    expect(new Date(response.data.to).getTime()).toStrictEqual(
      new Date(TO).getTime(),
    );
    expect(response.data.type).toEqual(TYPE);
    expect(response.data.image).toBe(IMAGE);
    expect(response.data.touristRoute.toString()).toBe(routeId.toString());
  });
});
