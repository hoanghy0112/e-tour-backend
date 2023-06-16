import { Socket } from 'socket.io';
import { handleViewTour } from './viewTour';
import { handleDeleteTour } from './deleteTour';

export default function handleTour(socket: Socket) {
  handleViewTour(socket);
  handleDeleteTour(socket);
}
