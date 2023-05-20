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

describe('Create voucher', () => {
  let clientSocket: Socket;
  let companyId: any;

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
  });

  afterEach(() => {
    clientSocket.close();
  });

  test('Test with valid voucher', async () => {
    const image = {
      buffer: readFileSync(path.join(__dirname, './voucher.jpg')),
      originalname: 'voucher.jpg',
    };
    clientSocket.emit(SocketClientMessage.voucher.CREATE_VOUCHER, {
      name: 'new voucher',
      image,
      companyId,
      expiredAt: new Date(),
      type: VoucherType.DISCOUNT,
      description: '',
      usingCondition: '',
      value: 0.3,
    });

    const response = await socketRequest((resolve, reject) => {
      clientSocket.on(
        SocketServerMessage.voucher.CREATE_VOUCHER_RESULT,
        (d) => {
          resolve(d);
        },
      );
      clientSocket.on(SocketServerMessage.ERROR, (e) => {
        resolve(e);
      });
    });

    console.log({ response });

    expect(response.status).toBe(200);
  }, 15000);
});
