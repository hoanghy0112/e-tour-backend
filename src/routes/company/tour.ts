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
import { BadRequestError, InternalError } from '../../core/ApiError';
import { TourError, TourErrorType } from '../../database/error/Tour';

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
        let newTour;
        try {
          newTour = await TourRepo.findById(tour.touristRoute);

          if (newTour)
            return new BadRequestResponse('Tour has been existed').sendSocket(
              socket,
              SocketServerMessage.ERROR,
            );
        } catch (e: any) {
          if (
            e instanceof TourError &&
            e.type == TourErrorType.TOUR_NOT_FOUND
          ) {
          } else if (e.name == 'CastError') {
            throw new BadRequestError('Tourist route is invalid');
          } else {
            throw e;
          }
        }

        const createdTour = await TourRepo.create(tour);

        return new SuccessResponse(
          'Create tour successfully',
          createdTour,
        ).sendSocket(socket, SocketServerMessage.CREATE_TOUR_RESULT);
      },
    ),
  );
}
