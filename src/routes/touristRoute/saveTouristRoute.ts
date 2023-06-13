import { Socket } from 'socket.io';
import { BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { IUser } from '../../database/model/User/User';
import TourRouteRepo from '../../database/repository/Company/TourRoute/TourRouteRepo';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from './schema';

export default function handleManageSavedTouristRoute(socket: Socket) {
  handleSaveTouristRoute(socket);
  handleRemoveTouristRouteFromSaved(socket);
}

export function handleSaveTouristRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.savedTouristRoute.SAVE_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.savedTouristRoute.saveRoute),
      async ({ routeId }: { routeId: string }) => {
        const user = socket.data.user as IUser;
        const userId = user._id?.toString();

        if (!userId) throw new BadRequestError('userId not found');

        await TourRouteRepo.addToSaved(routeId, userId);

        return new SuccessResponse(
          'Successfully save tourist route',
          {},
        ).sendSocket(
          socket,
          SocketServerMessage.savedTouristRoute.SAVE_ROUTE_RESULT,
        );
      },
    ),
  );
}

export function handleRemoveTouristRouteFromSaved(socket: Socket) {
  socket.on(
    SocketClientMessage.savedTouristRoute.REMOVE_ROUTE_FROM_SAVED,
    socketAsyncHandler(
      socket,
      socketValidator(schema.savedTouristRoute.removeRoute),
      async ({ routeId }: { routeId: string }) => {
        const user = socket.data.user as IUser;
        const userId = user._id?.toString();

        if (!userId) throw new BadRequestError('userId not found');

        await TourRouteRepo.removeFromSaved(routeId, userId);

        return new SuccessResponse(
          'Successfully remove tourist route from saved list',
          {},
        ).sendSocket(
          socket,
          SocketServerMessage.savedTouristRoute.REMOVE_ROUTE_FROM_SAVED_RESULT,
        );
      },
    ),
  );
}
