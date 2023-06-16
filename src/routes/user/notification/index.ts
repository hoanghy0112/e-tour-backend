import { Socket } from 'socket.io';
import {
  handleReadNotification,
  handleViewNewNotification,
} from './notification';

export default function handleNotification(socket: Socket) {
  handleViewNewNotification(socket);
  handleReadNotification(socket);
}
