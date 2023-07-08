import { Socket } from 'socket.io';
import { BadRequestError, InternalError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import {
  VoucherError,
  VoucherErrorType,
} from '../../../database/error/Voucher';
import TicketModel, { ITicket } from '../../../database/model/User/Ticket';
import TicketRepo from '../../../database/repository/User/TicketRepo';
import WatchTable from '../../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';

export async function handleBookTicket(socket: Socket) {
  socket.on(
    SocketClientMessage.BOOK_TICKET,
    socketAsyncHandler(
      socket,
      socketValidator(schema.bookTicket),
      async ({
        ticketInfo,
        voucherIds = [],
      }: {
        ticketInfo: ITicket;
        voucherIds?: string[];
      }) => {
        try {
          const userId = socket.data?.user._id;
          ticketInfo.userId = userId;

          const createdTicket = await TicketRepo.create({
            ticketInfo,
            voucherIds,
          });

          // const listener = WatchTable.register(TicketModel, socket)
          //   .filter(
          //     (ticket: ITicket) =>
          //       ticket._id?.toString() === createdTicket?._id,
          //   )
          //   .do((data, listenerId) => {
          //     new SuccessResponse(
          //       'Updated ticket',
          //       data,
          //       listenerId,
          //     ).sendSocket(socket, SocketServerMessage.UPDATED_RATE);
          //   });

          return new SuccessResponse(
            'Successfully book ticket',
            createdTicket,
            // listener.getId(),
          ).sendSocket(socket, SocketServerMessage.BOOKED_TICKET);
        } catch (e: any) {
          if (e instanceof VoucherError) {
            if (e.type === VoucherErrorType.VOUCHER_NOT_FOUND)
              throw new BadRequestError('Voucher not found');
            else if (e.type === VoucherErrorType.EXPIRED_VOUCHER)
              throw new BadRequestError('Voucher is expired');
          } else if (e instanceof BadRequestError) throw e;
          else throw new InternalError(e?.stack);
        }
      },
    ),
  );
}
