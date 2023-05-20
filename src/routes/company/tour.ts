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
import { uploadImageToS3 } from '../../database/s3';

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
        if (tour.image) {
          const tourImageName = await uploadImageToS3(
            tour.image as any,
          );
          tour.image = tourImageName || '';
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
