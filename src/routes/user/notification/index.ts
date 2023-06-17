import { Socket } from 'socket.io';
import {
  handleReadNotification,
  handleViewNewNotification,
} from './notification';
import handlePushNotification from './handlePushNotification';

export default function handleNotification(socket: Socket) {
  handleViewNewNotification(socket);
  handleReadNotification(socket);
  handlePushNotification(socket);
}
