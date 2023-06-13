import { Socket } from 'socket.io';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import TouristsRouteModel, {
  ITouristsRoute,
} from '../../database/model/Company/TouristsRoute';
import UserModel, { IUser } from '../../database/model/User/User';
import TourRouteRepo from '../../database/repository/Company/TourRoute/TourRouteRepo';
import WatchTable from '../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from './schema';

export async function handleViewTouristRoute(socket: Socket) {
  handleViewRecommendTouristRoute(socket);
  handleViewTouristRouteById(socket);
  handleViewTouristRouteByFilter(socket);
  handleViewSavedTouristRoute(socket);
  handleIncreaseRoutePoint(socket);
  handleViewPopularTouristRoute(socket);
}

async function handleViewRecommendTouristRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_RECOMMEND_ROUTE,
    socketAsyncHandler(socket, async ({ num = 1 }: { num: number }) => {
      const touristRoutes = await TourRouteRepo.findRecommend(num);

      return new SuccessResponse(
        'Successfully retrieve tourist route',
        touristRoutes,
      ).sendSocket(socket, SocketServerMessage.LIST_ROUTE);
    }),
  );
}

async function handleViewTouristRouteById(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewTouristRoute.byId),
      async ({ id }: { id: string }) => {
        const listener = WatchTable.register(TouristsRouteModel, socket)
          .filter((data: ITouristsRoute) => data._id.toString() === id)
          .do((data, listenerId) => {
            new SuccessResponse('update route', data, listenerId).sendSocket(
              socket,
              SocketServerMessage.ROUTE,
            );
          });
        try {
          const touristRoute = await TourRouteRepo.findById(id);

          return new SuccessResponse(
            'successfully retrieve tourist route',
            touristRoute,
            listener.getId(),
          ).sendSocket(socket, SocketServerMessage.ROUTE);
        } catch (e) {
          return new BadRequestResponse('Tourist route not found').sendSocket(
            socket,
            SocketServerMessage.ERROR,
          );
        }
      },
    ),
  );
}

async function handleViewTouristRouteByFilter(socket: Socket) {
  socket.on(
    SocketClientMessage.FILTER_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewTouristRoute.byFilter),
      async ({ route, keyword }: { route: string[]; keyword: string }) => {
        const listener = WatchTable.register(TouristsRouteModel, socket)
          .filter(
            (data: ITouristsRoute) =>
              route.every((place) => data.route.includes(place)) &&
              data.name.search(keyword) !== -1,
          )
          .do((data, listenerId) => {
            new SuccessResponse('new route', data, listenerId).sendSocket(
              socket,
              SocketServerMessage.NEW_ROUTE,
            );
          });
        const touristRoutes = await TourRouteRepo.filter({ route, keyword });

        return new SuccessResponse(
          'successfully retrieve tourist route',
          touristRoutes,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.RETRIEVE_TOURIST_ROUTES);
      },
    ),
  );
}

async function handleViewSavedTouristRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.savedTouristRoute.VIEW_SAVED_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.savedTouristRoute.viewSavedTouristRoute),
      async () => {
        const user = socket.data.user as IUser;
        const userId = user._id?.toString();

        const listener = WatchTable.register(UserModel, socket)
          .filter((data: IUser) => data._id?.toString() === userId)
          .do(async (data: IUser, listenerId) => {
            const touristRoutes = await TourRouteRepo.findSaved(userId);

            new SuccessResponse(
              'update saved route',
              touristRoutes,
              listenerId,
            ).sendSocket(
              socket,
              SocketServerMessage.savedTouristRoute.SAVED_ROUTE,
            );
          });

        const touristRoutes = await TourRouteRepo.findSaved(userId);

        return new SuccessResponse(
          'Successfully retrieve saved tourist route',
          touristRoutes,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.savedTouristRoute.SAVED_ROUTE);
      },
    ),
  );
}

async function handleIncreaseRoutePoint(socket: Socket) {
  socket.on(
    SocketClientMessage.touristRoute.INCREASE_POINT,
    socketAsyncHandler(
      socket,
      socketValidator(schema.increasePoint),
      async ({ routeId, point }: { routeId: string; point: number }) => {
        TourRouteRepo.increasePoint(routeId, point);
      },
    ),
  );
}

async function handleViewPopularTouristRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.touristRoute.VIEW_POPULAR_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewTouristRoute.byPopularity),
      async ({ num, skip }: { num: number; skip: number }) => {
        const routes = await TourRouteRepo.findPopular(num, skip);

        return new SuccessResponse(
          'Successfully retrieve popular tourist route',
          routes,
        ).sendSocket(
          socket,
          SocketServerMessage.touristRoute.VIEW_POPULAR_ROUTE_RESULT,
        );
      },
    ),
  );
}