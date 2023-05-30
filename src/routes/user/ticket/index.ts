import { Socket } from 'socket.io';
import { handleBookTicket } from './bookTicket';
import { handleViewTicketList } from './viewTicketList';
import { handleViewDetailTicket } from './viewDetailTicket';
import { handleUpdateTicket } from './updateTicket';

export default function handleTicket(socket: Socket) {
  handleBookTicket(socket);
  handleUpdateTicket(socket);
  handleViewTicketList(socket);
  handleViewDetailTicket(socket);
}
