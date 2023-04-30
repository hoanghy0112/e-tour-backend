import { Socket } from 'socket.io';
import socketAuthorization from '../../auth/socketAuthorization';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import { StaffPermission } from '../../database/model/Company/Staff';
import { ITour } from '../../database/model/Company/Tour';
import TourRepo from '../../database/repository/Company/TourRepo/TourRepo';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from './schema';

export default function handleTourSocket(socket: Socket) {
  handleCreateTour(socket);
}

export function handleCreateTour(socket: Socket) {
  socket.on(
    SocketClientMessage.CREATE_TOUR,
    socketAsyncHandler(
      socket,
      socketValidator(schema.createTour),
      socketAuthorization([StaffPermission.EDIT_TOUR]),
      async (tour: ITour) => {
        try {
          const newTour = await TourRepo.findById(tour.touristRoute);
          if (newTour)
            return new BadRequestResponse('Tour has been existed').sendSocket(
              socket,
              SocketServerMessage.ERROR,
            );

          const createdTour = await TourRepo.create(tour);

          return new SuccessResponse(
            'Create tour successfully',
            createdTour,
          ).sendSocket(socket, SocketServerMessage.CREATE_TOUR_RESULT);
        } catch (e) {
          return new BadRequestResponse('Failed to create tour').sendSocket(
            socket,
            SocketServerMessage.ERROR,
          );
        }
      },
    ),
  );
}
