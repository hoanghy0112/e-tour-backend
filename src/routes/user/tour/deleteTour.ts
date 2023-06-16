import { Socket } from 'socket.io';
import { BadRequestError } from '../../../core/ApiError';
import { BadRequestResponse, SuccessResponse } from '../../../core/ApiResponse';
import TourModel, { ITour } from '../../../database/model/Company/Tour';
import TourRepo from '../../../database/repository/Company/TourRepo/TourRepo';
import WatchTable from '../../../helpers/realtime/WatchTable';
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
      async ({ id }: { id: string }) => {
        const tour = await TourRepo.remove(id);
        if (!tour) throw new BadRequestError('tour not found');

        return new SuccessResponse('Success', tour).sendSocket(
          socket,
          SocketServerMessage.TOUR_EVENTS.DELETE_TOUR_RESULT,
        );
      },
    ),
  );
}
