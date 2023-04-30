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

describe('View tourist route by filter', () => {
  let clientSocket: Socket;

  beforeAll(async () => {
    setupTestedSocketServer();
    await TouristsRouteModel.create({
      reservationFee: 5,
      name: 'First vacation',
      description: 'Lorem ipsum',
      route: ['Sai Gon', 'Tay Son'],
      companyId: '6406e44a7144bb633674d32e',
    });
    await TouristsRouteModel.create({
      reservationFee: 5,
      name: 'Second vacation',
      description: 'Lorem ipsum',
      route: ['Sai Gon', 'Ha Noi'],
      companyId: '6406e44a7144bb633674d32e',
    });
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
    { route: ['Tay Son'], number: 1 },
    { route: ['Sai Gon'], number: 2 },
    { route: ['Ha Noi'], number: 1 },
    { route: ['Ha Noi', 'Sai Gon'], number: 1 },
    { route: [], number: 2 },
  ])('Filter by route', async ({ route, number }) => {
    clientSocket.emit(SocketClientMessage.FILTER_ROUTE, { route });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.RETRIEVE_TOURIST_ROUTES, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });
    expect(response.data.length).toBe(number);
  });

  test.each([
    { keyword: 'vacation', number: 2 },
    { keyword: 'Vacation', number: 2 },
    { keyword: 'First', number: 1 },
    { keyword: '', number: 2 },
  ])('Filter by keyword', async ({ keyword, number }) => {
    clientSocket.emit(SocketClientMessage.FILTER_ROUTE, { keyword });
    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.RETRIEVE_TOURIST_ROUTES, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        reject(e);
      });
    });
    expect(response.data.length).toBe(number);
  });
});
