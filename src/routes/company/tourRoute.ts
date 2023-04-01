import { Socket } from 'socket.io';
import { TouristsRoute } from '../../database/model/Company/TouristsRoute';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import schema from './schema';
import { SuccessResponse } from '../../core/ApiResponse';
import socketAuthorization from '../../auth/socketAuthorization';
import { StaffPermission } from '../../database/model/Company/Staff';
import TourRouteRepo from '../../database/repository/Company/TourRoute/TourRouteRepo';
import { BadRequestError } from '../../core/ApiError';
import Logger from '../../core/Logger';

export default function handleTourRouteSocket(socket: Socket) {
  handleCreateTourRoute(socket);
}

async function handleCreateTourRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.CREATE_COMPANY,
    socketAsyncHandler(
      socket,
      socketValidator(schema.createTourRoute),
      socketAuthorization([StaffPermission.EDIT_ROUTE]),
      async (tourRoute: TouristsRoute) => {
        const listRoute = await TourRouteRepo.list(tourRoute.companyId);
        if (listRoute?.find((v) => v.name === tourRoute.name))
          throw new BadRequestError('Route name exists');

        TourRouteRepo.create(tourRoute);

        return new SuccessResponse(
          'Create tourist route successfully',
          tourRoute,
        ).sendSocket(socket, SocketServerMessage.CREATE_COMPANY_RESULT);
      },
    ),
  );
}
