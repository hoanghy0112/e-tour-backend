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
  handleChangeTourRoute(socket);
  handleCreateTourRoute(socket);
}

async function handleChangeTourRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.EDIT_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.editTourRoute),
      socketAuthorization([StaffPermission.EDIT_ROUTE]),
      async (tourRoute: TouristsRoute) => {
        const { _id, ...data } = tourRoute;

        try {
          const touristRoute = await TourRouteRepo.edit(
            _id,
            data as TouristsRoute,
          );

          return new SuccessResponse(
            'Update tourist route successfully',
            touristRoute,
          ).sendSocket(socket, SocketServerMessage.EDIT_ROUTE_RESULT);
        } catch (e) {}
      },
    ),
  );
}

async function handleCreateTourRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.CREATE_ROUTE,
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
        ).sendSocket(socket, SocketServerMessage.CREATE_ROUTE_RESULT);
      },
    ),
  );
}
