import { Socket } from 'socket.io';
import handleSocketAPI from '../../../helpers/handleSocketAPI';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import TicketModel from '../../../database/model/User/Ticket';
import { SuccessResponse } from '../../../core/ApiResponse';

export function handleViewTicketByFilter(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.ticket.FILTER_TICKET,
    serverEvent: SocketServerMessage.ticket.FILTER_TICKET_RESULT,
    handler: async (filter: any) => {
      const tickets = await TicketModel.find(filter);

      return new SuccessResponse('Success', tickets).sendSocket(
        socket,
        SocketServerMessage.ticket.FILTER_TICKET_RESULT,
      );
    },
  });
}
