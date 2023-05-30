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

export async function handleViewDetailTicket(socket: Socket) {
  socket.on(
    SocketClientMessage.ticket.VIEW_DETAIL_TICKET,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewBookedTicket),
      async () => {
        const client = socket.data.user as IUser;
        if (!client._id) throw new BadRequestError('Client id not found');

        const tickets = await TicketRepo.findAllTicketOfUser(client._id);

        const ticketsMap = new Map();
        tickets.forEach((ticket: any) =>
          ticketsMap.set(ticket._id?.toString(), ticket),
        );

        const listener = WatchTable.register(TicketModel, socket)
          .filter(
            (data: ITicket | null, id: string) =>
              data?.userId?.toString() === client._id?.toString() ||
              Array.from(ticketsMap.keys()).includes(id),
          )
          .do(async (data: ITicket, listenerId, id) => {
            if (data == null) ticketsMap.delete(id);
            else {
              const populatedData = await TicketModel.findById(id).populate({
                path: 'tourId',
                populate: {
                  path: 'touristRoute',
                },
              });
              ticketsMap.set(id, populatedData);
            }

            new SuccessResponse(
              'new ticket list',
              Array.from(ticketsMap.values()),
              listenerId,
            ).sendSocket(socket, SocketServerMessage.ticket.BOOKED_TICKET_LIST);
          });

        return new SuccessResponse(
          'successfully retrieve ticket list',
          tickets,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.ticket.BOOKED_TICKET_LIST);
      },
    ),
  );
}
