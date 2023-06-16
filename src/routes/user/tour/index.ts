import { Socket } from 'socket.io';
import { handleViewTour } from './viewTour';
import { handleDeleteTour } from './deleteTour';
import { handleUpdateTour } from './updateTour';
import { handleCreateTour } from './createTour';

export default function handleTour(socket: Socket) {
  handleViewTour(socket);
  handleDeleteTour(socket);
  handleUpdateTour(socket);
  handleCreateTour(socket);
}
