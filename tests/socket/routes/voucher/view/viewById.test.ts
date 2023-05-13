import { Socket } from 'socket.io-client';
import {
  cleanUpSocketServer,
  getSocketInstance,
  setupTestedSocketServer,
} from '../../../utils';
import { readFileSync } from 'fs';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../../../src/types/socket';
import VoucherModel, {
  IVoucher,
  VoucherType,
} from '../../../../../src/database/model/User/Voucher';
import socketRequest from '../../../../../src/helpers/socketRequest';
import path from 'path';

describe('View voucher by id', () => {
  let clientSocket: Socket;
  let companyId: any;
  let voucher: any;

  beforeAll(async () => {
    setupTestedSocketServer();
  });
  afterAll(async () => {
    cleanUpSocketServer();
  });

  beforeEach(async () => {
    const client = await getSocketInstance('staff');
    clientSocket = client.socket;
    companyId = client.id;
    voucher = await VoucherModel.create({
      companyId,
      expiredAt: new Date(),
      type: VoucherType.DISCOUNT,
      description: '',
      usingCondition: '',
      value: 0.3,
    });
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('Test with valid voucher', async () => {
    clientSocket.emit(SocketClientMessage.voucher.VIEW_BY_VOUCHER_ID, {
      id: voucher._id.toString(),
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.voucher.VOUCHER, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });

    console.log({ response });
    expect(response.status).toBe(200);
    expect(response.data.value).toBe(0.3);
  }, 15000);

  test('Test with invalid voucher', async () => {
    clientSocket.emit(SocketClientMessage.voucher.VIEW_BY_VOUCHER_ID, {
      id: 'An invalid id',
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(SocketServerMessage.voucher.VOUCHER, (d) => {
        resolve(d);
      });
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });

    expect(response.status).toBe(400);
  }, 15000);
});
