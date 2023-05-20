import { Socket } from 'socket.io';
import { BadRequestError } from '../../../core/ApiError';
import { BadRequestResponse, SuccessResponse } from '../../../core/ApiResponse';
import TourModel, { ITour } from '../../../database/model/Company/Tour';
import TourRepo from '../../../database/repository/Company/TourRepo/TourRepo';
import WatchTable, {
  IOperationType,
} from '../../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';
import VoucherRepo from '../../../database/repository/User/VoucherRepo';
import VoucherModel, { IVoucher } from '../../../database/model/User/Voucher';

export async function handleViewVoucher(socket: Socket) {
  handleViewVoucherById(socket);
  handleViewNewVoucher(socket);
}

async function handleViewVoucherById(socket: Socket) {
  socket.on(
    SocketClientMessage.voucher.VIEW_BY_VOUCHER_ID,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewVoucher.byId),
      async ({ id }: { id: string }) => {
        const voucher = await VoucherRepo.viewById(id);

        const listener = WatchTable.register(VoucherModel, socket)
          .filter((data: IVoucher) => data._id?.toString() === id)
          .do((data, listenerId) => {
            new SuccessResponse('update voucher', data, listenerId).sendSocket(
              socket,
              SocketServerMessage.voucher.VOUCHER,
            );
          });

        return new SuccessResponse(
          'successfully retrieve voucher information',
          voucher,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.voucher.VOUCHER);
      },
    ),
  );
}

async function handleViewNewVoucher(socket: Socket) {
  socket.on(
    SocketClientMessage.voucher.VIEW_NEW_VOUCHER,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewVoucher.newVoucher),
      async ({ num }: { num: number }) => {
        const vouchers = await VoucherRepo.viewNewest(num);

        const listener = WatchTable.register(VoucherModel, socket)
          // .filter(
          //   (data: IVoucher, id, operationType) =>
          //     operationType == IOperationType.INSERT ||
          //     operationType == IOperationType.DELETE,
          // )
          .do(async (data, listenerId) => {
            const vouchers = await VoucherRepo.viewNewest(num);

            return new SuccessResponse(
              'successfully retrieve vouchers',
              vouchers,
              listenerId,
            ).sendSocket(socket, SocketServerMessage.voucher.NEW_VOUCHER_LIST);
          });

        return new SuccessResponse(
          'successfully retrieve vouchers',
          vouchers,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.voucher.NEW_VOUCHER_LIST);
      },
    ),
  );
}
