import { Socket } from 'socket.io';
import { SuccessResponse } from '../../../core/ApiResponse';
import CompanyModel from '../../../database/model/Company/Company';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';
import TouristsRouteModel from '../../../database/model/Company/TouristsRoute';

export function handleFollowTouristRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.touristRoute.FOLLOW_TOURIST_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.followTouristRoute),
      async ({ routeId }: { routeId: string }) => {
        const userId = socket.data.user;

        await TouristsRouteModel.findByIdAndUpdate(routeId, {
          $addToSet: {
            followers: userId,
          },
        });

        return new SuccessResponse(
          'successfully follow tourist route',
          {},
        ).sendSocket(
          socket,
          SocketServerMessage.touristRoute.FOLLOW_TOURIST_ROUTE_RESULT,
        );
      },
    ),
  );
}
