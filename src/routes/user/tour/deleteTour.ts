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

export async function handleDeleteTour(socket: Socket) {
  socket.on(
    SocketClientMessage.TOUR.DELETE_TOUR,
    socketAsyncHandler(
      socket,
      socketValidator(schema.deleteTour),
      async (ids: string[]) => {
        await TourRepo.remove(ids);
        // if (!tour) throw new BadRequestError('tour not found');

        return new SuccessResponse('Success', ids).sendSocket(
          socket,
          SocketServerMessage.TOUR_EVENTS.DELETE_TOUR_RESULT,
        );
      },
    ),
  );
}
