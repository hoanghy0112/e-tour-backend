import { Socket } from 'socket.io';
import { BadRequestError, InternalError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import TourModel, { ITour } from '../../../database/model/Company/Tour';
import TourRepo from '../../../database/repository/Company/TourRepo/TourRepo';
import WatchTable from '../../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';
import TicketModel, { ITicket } from '../../../database/model/User/Ticket';
import TicketRepo from '../../../database/repository/User/TicketRepo';
import {
  VoucherError,
  VoucherErrorType,
} from '../../../database/error/Voucher';

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
          const createdTicket = await TicketRepo.create({
            ticketInfo,
            voucherIds,
          });

          WatchTable.register(TicketModel)
            .filter(
              (ticket: ITicket) =>
                ticket._id?.toString() === createdTicket?._id,
            )
            .do((data) => {
              new SuccessResponse('Updated ticket', data).sendSocket(
                socket,
                SocketServerMessage.BOOKED_TICKET,
              );
            });

          return new SuccessResponse(
            'Successfully book ticket',
            createdTicket,
          ).sendSocket(socket, SocketServerMessage.BOOKED_TICKET);
        } catch (e: any) {
          if (e instanceof VoucherError) {
            if (e.type === VoucherErrorType.VOUCHER_NOT_FOUND)
              throw new BadRequestError('Voucher not found');
            else if (e.type === VoucherErrorType.EXPIRED_VOUCHER)
              throw new BadRequestError('Voucher is expired');
          } else {
            throw new InternalError(e?.stack);
          }
        }
      },
    ),
  );
}
