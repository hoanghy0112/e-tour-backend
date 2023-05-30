import { Socket } from 'socket.io';
import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import TicketModel, { ITicket } from '../../../database/model/User/Ticket';
import { IUser } from '../../../database/model/User/User';
import TicketRepo from '../../../database/repository/User/TicketRepo';
import WatchTable from '../../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';

export async function handleUpdateTicket(socket: Socket) {
  socket.on(
    SocketClientMessage.ticket.UPDATE_TICKET,
    socketAsyncHandler(
      socket,
      socketValidator(schema.updateTicket),
      async ({
        ticketId,
        ticketInfo,
      }: {
        ticketId: string;
        ticketInfo: any;
      }) => {
        const client = socket.data.user as IUser;
        if (!client._id) throw new BadRequestError('Client id not found');

        const ticket = await TicketRepo.update(
          ticketId,
          client._id.toString(),
          ticketInfo,
        );

        return new SuccessResponse('success', ticket).sendSocket(
          socket,
          SocketServerMessage.ticket.UPDATE_TICKET_RESULT,
        );
      },
    ),
  );
}
