import { Socket } from 'socket.io';
import {
  handleReadNotification,
  handleViewAllNotification,
  handleViewNewNotification,
  handleViewNotificationOfTour,
} from './notification';
import handlePushNotification from './handlePushNotification';

export default function handleNotification(socket: Socket) {
  handleViewNewNotification(socket);
  handleViewAllNotification(socket);
  handleViewNotificationOfTour(socket);
  handleReadNotification(socket);
  handlePushNotification(socket);
}
