import { Socket } from 'socket.io';
import socketAuthorization from '../../auth/socketAuthorization';
import { SuccessResponse } from '../../core/ApiResponse';
import { StaffPermission } from '../../database/model/Company/Staff';
import { IVoucher } from '../../database/model/User/Voucher';
import VoucherRepo from '../../database/repository/User/VoucherRepo';
import { uploadImageToS3 } from '../../database/s3';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from '../company/schema';

export function handleCreateVoucher(socket: Socket) {
  socket.on(
    SocketClientMessage.voucher.CREATE_VOUCHER,
    socketAsyncHandler(
      socket,
      socketValidator(schema.voucher.createVoucher),
      socketAuthorization([StaffPermission.EDIT_VOUCHER]),
      async (voucherInfo: IVoucher) => {
        if (voucherInfo.image) {
          const voucherImageName = await uploadImageToS3(
            voucherInfo.image as any,
          );
          voucherInfo.image = voucherImageName || '';
        }
        const voucher = await VoucherRepo.create(voucherInfo);

        return new SuccessResponse(
          'Create voucher successfully',
          voucher,
        ).sendSocket(socket, SocketServerMessage.voucher.CREATE_VOUCHER_RESULT);
      },
    ),
  );
}
