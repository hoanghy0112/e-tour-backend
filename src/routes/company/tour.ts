import { Socket } from 'socket.io';
import socketAuthorization from '../../auth/socketAuthorization';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import { StaffPermission } from '../../database/model/Company/Staff';
import { TouristsRoute } from '../../database/model/Company/TouristsRoute';
import TourRouteRepo from '../../database/repository/Company/TourRoute/TourRouteRepo';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from './schema';
import { Tour } from '../../database/model/Company/Tour';
import TourRepo from '../../database/repository/Company/TourRepo/TourRepo';

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
      async (tour: Tour) => {
        try {
          // fix after: Wrong error message when touristRoute is passed with wrong format
          const tourRoute = await TourRouteRepo.findById(tour.touristRoute);
          if (!tourRoute)
            return new BadRequestResponse('Tour route not found').sendSocket(
              socket,
              SocketServerMessage.ERROR,
            );

          const createdTour = await TourRepo.create(tour);

          return new SuccessResponse(
            'Update tourist route successfully',
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
