import { Socket } from 'socket.io';
import { SuccessResponse } from '../../core/ApiResponse';
import VoucherModel, { IVoucher } from '../../database/model/User/Voucher';
import VoucherRepo from '../../database/repository/User/VoucherRepo';
import WatchTable from '../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../types/app-request';
import { BadRequestError, InternalError } from '../../core/ApiError';

export async function handleViewVoucher(socket: Socket) {
  handleViewVoucherById(socket);
  handleViewNewVoucher(socket);
  handleViewCompanyVoucher(socket);
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

        const listener = WatchTable.register(VoucherModel, socket).do(
          async (data, listenerId) => {
            const vouchers = await VoucherRepo.viewNewest(num);

            return new SuccessResponse(
              'successfully retrieve vouchers',
              vouchers,
              listenerId,
            ).sendSocket(socket, SocketServerMessage.voucher.NEW_VOUCHER_LIST);
          },
        );

        return new SuccessResponse(
          'successfully retrieve vouchers',
          vouchers,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.voucher.NEW_VOUCHER_LIST);
      },
    ),
  );
}

export const viewSavedVoucher = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const isPopulate = req.query?.populate == 'true';

    const userId = req.user._id;

    if (!userId) throw new BadRequestError('userId not found');

    const savedVouchers = await VoucherRepo.viewSaved(userId, isPopulate);

    return new SuccessResponse('Success', savedVouchers.reverse()).send(res);
  },
);

async function handleViewCompanyVoucher(socket: Socket) {
  socket.on(
    SocketClientMessage.voucher.VIEW_COMPANY_VOUCHER,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewVoucher.newVoucher),
      async ({ num }: { num: number }) => {
        const staff = socket.data?.staff;
        const companyId = staff?.companyId;

        if (!companyId) throw new InternalError('companyId not found');

        const vouchers = await VoucherModel.find({ companyId });

        const listener = WatchTable.register(VoucherModel, socket).do(
          async (data, listenerId) => {
            const vouchers = await VoucherModel.find({ companyId });

            return new SuccessResponse(
              'successfully retrieve vouchers',
              vouchers,
              listenerId,
            ).sendSocket(
              socket,
              SocketServerMessage.voucher.VIEW_COMPANY_VOUCHER_RESULT,
            );
          },
        );

        return new SuccessResponse(
          'successfully retrieve vouchers',
          vouchers,
          listener.getId(),
        ).sendSocket(
          socket,
          SocketServerMessage.voucher.VIEW_COMPANY_VOUCHER_RESULT,
        );
      },
    ),
  );
}
