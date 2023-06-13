import express from 'express';
import { Socket } from 'socket.io';
import { handleBookTicket } from './bookTicket';
import { handleViewTicketList } from './viewTicketList';
import { handleViewDetailTicket } from './viewDetailTicket';
import { handleUpdateTicket } from './updateTicket';
import { discardTicket } from './discardTicket';
import validator from '../../../helpers/validator';
import schema from './schema';

export const ticketRouter = express.Router();

ticketRouter.delete('/', validator(schema.discardTicket), discardTicket);

export default function handleTicket(socket: Socket) {
  handleBookTicket(socket);
  handleUpdateTicket(socket);
  handleViewTicketList(socket);
  handleViewDetailTicket(socket);
}
