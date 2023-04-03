import { Socket } from 'socket.io';
import { BadRequestError } from '../core/ApiError';
import { SuccessResponse } from '../core/ApiResponse';
import socketAsyncHandler from '../helpers/socketAsyncHandler';
import Logger from '../core/Logger';
import { SocketClientMessage, SocketServerMessage } from '../types/socket';
import handleTourRouteSocket from './company/tourRoute';
import { handleViewTouristRoute } from './user/touristRoute/viewTouristRoute';
import handleTourSocket from './company/tour';
import { handleViewTour } from './user/tour/viewTour';
import { handleViewStaffInformation } from './company/staffInformation';

export default function socketRouter(socket: Socket) {
  handleTourSocket(socket);
  handleViewTour(socket);
  handleTourRouteSocket(socket);
  handleViewTouristRoute(socket);
  handleViewStaffInformation(socket);

  socket.on(
    SocketClientMessage.PING,
    socketAsyncHandler(socket, async (data: { text: string }) => {
      // For test
      if (data.text !== 'OK') throw new BadRequestError('Text data is not ok');
      return new SuccessResponse('connection is ok', {
        text: 'Yes',
        data: socket.data,
      }).sendSocket(socket);
    }),
  );
}
