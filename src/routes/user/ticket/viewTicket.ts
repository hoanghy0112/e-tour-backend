import { Socket } from 'socket.io';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import TourRouteRepo from '../../../database/repository/Company/TourRoute/TourRouteRepo';
import schema from './schema';
import { BadRequestResponse, SuccessResponse } from '../../../core/ApiResponse';
import WatchTable from '../../../helpers/realtime/WatchTable';
import TouristsRouteModel, {
  TouristsRoute,
} from '../../../database/model/Company/TouristsRoute';
import Logger from '../../../core/Logger';
import TourModel, { ITour } from '../../../database/model/Company/Tour';
import TourRepo from '../../../database/repository/Company/TourRepo/TourRepo';
import { BadRequestError } from '../../../core/ApiError';
import TicketModel, { ITicket } from '../../../database/model/User/Ticket';
import { IUser } from '../../../database/model/User/User';
import TicketRepo from '../../../database/repository/User/TicketRepo';

export async function handleViewTicketList(socket: Socket) {
  socket.on(
    SocketClientMessage.ticket.VIEW_BOOKED_TICKET,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewBookedTicket),
      async () => {
        const client = socket.data.user as IUser;
        if (!client._id) throw new BadRequestError('Client id not found');

        const tickets = await TicketRepo.findAllTicketOfUser(client._id);

        const ticketsMap = new Map();
        tickets.forEach((ticket) =>
          ticketsMap.set(ticket._id?.toString(), ticket),
        );

        const listener = WatchTable.register(TicketModel, socket)
          .filter(
            (data: ITicket | null, id: string) =>
              data?.userId?.toString() === client._id?.toString() ||
              Array.from(ticketsMap.keys()).includes(id),
          )
          .do((data, listenerId, id) => {
            if (data == null) ticketsMap.delete(id);
            else ticketsMap.set(id, data);

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
