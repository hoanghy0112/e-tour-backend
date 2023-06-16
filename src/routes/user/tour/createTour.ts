import { Socket } from 'socket.io';
import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import TourRepo from '../../../database/repository/Company/TourRepo/TourRepo';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';
import { StaffPermission } from '../../../database/model/Company/Staff';
import socketAuthorization from '../../../auth/socketAuthorization';
import { ITour } from '../../../database/model/Company/Tour';
import { uploadImageToS3 } from '../../../database/s3';

export function handleCreateTour(socket: Socket) {
  socket.on(
    SocketClientMessage.CREATE_TOUR,
    socketAsyncHandler(
      socket,
      socketValidator(schema.createTour),
      socketAuthorization([StaffPermission.EDIT_TOUR]),
      async (tour: ITour) => {
        if (tour.image) {
          const tourImageName = await uploadImageToS3(tour.image as any);
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
