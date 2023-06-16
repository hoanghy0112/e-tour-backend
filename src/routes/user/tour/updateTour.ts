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
import { ITour } from '../../../database/model/Company/Tour';

export async function handleUpdateTour(socket: Socket) {
  socket.on(
    SocketClientMessage.TOUR.UPDATE_TOUR,
    socketAsyncHandler(
      socket,
      socketValidator(schema.deleteTour),
      async (newTour: ITour) => {
        const { _id: id, ...newTourData } = newTour;

        const tour = await TourRepo.update(id, newTourData);
        if (!tour) throw new BadRequestError('tour not found');

        return new SuccessResponse('Success', tour).sendSocket(
          socket,
          SocketServerMessage.TOUR_EVENTS.UPDATE_TOUR_RESULT,
        );
      },
    ),
  );
}
