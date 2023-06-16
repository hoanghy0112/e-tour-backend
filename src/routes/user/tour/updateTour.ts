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
import { uploadImageToS3 } from '../../../database/s3';

export async function handleUpdateTour(socket: Socket) {
  socket.on(
    SocketClientMessage.TOUR.UPDATE_TOUR,
    socketAsyncHandler(
      socket,
      socketValidator(schema.updateTour),
      async (newTour: ITour) => {
        const { _id: id, image, ...newTourData } = newTour;
        let imageName;
        // @ts-ignore
        if (image?.originalname) {
          // @ts-ignore
          imageName = await uploadImageToS3(image);
        }

        const tour = await TourRepo.update(id, {
          ...newTourData,
          ...(image ? { image: imageName } : {}),
        });
        if (!tour) throw new BadRequestError('tour not found');

        return new SuccessResponse('Success', tour).sendSocket(
          socket,
          SocketServerMessage.TOUR_EVENTS.UPDATE_TOUR_RESULT,
        );
      },
    ),
  );
}
