import { Socket } from 'socket.io';
import { SuccessResponse } from '../../../core/ApiResponse';
import CompanyModel, {
  IFollower,
  NotificationType,
} from '../../../database/model/Company/Company';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';
import TouristsRouteModel from '../../../database/model/Company/TouristsRoute';
import { INotification } from '../../../database/model/User/User';

export function handleFollowTouristRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.touristRoute.FOLLOW_TOURIST_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.followTouristRoute),
      async ({
        routeId,
        notificationType = NotificationType.ALL,
      }: {
        routeId: string;
        notificationType: string;
      }) => {
        const userId = socket.data.user._id;

        await TouristsRouteModel.findByIdAndUpdate(routeId, {
          $cond: {
            if: { 'followers.user': { $in: [userId] } },
            then: {
              $push: {
                followers: {
                  user: userId,
                  notificationType,
                } as IFollower,
              },
            },
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

export function handleUnFollowTouristRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.touristRoute.UNFOLLOW_TOURIST_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.unfollowTouristRoute),
      async ({ routeId }: { routeId: string }) => {
        const userId = socket.data.user._id;

        await TouristsRouteModel.findByIdAndUpdate(routeId, {
          $pull: {
            followers: {
              user: userId,
            },
          },
        });

        return new SuccessResponse(
          'successfully unfollow tourist route',
          {},
        ).sendSocket(
          socket,
          SocketServerMessage.touristRoute.UNFOLLOW_TOURIST_ROUTE_RESULT,
        );
      },
    ),
  );
}
