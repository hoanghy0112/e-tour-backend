import { Socket } from 'socket.io';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import TourRouteRepo from '../../../database/repository/Company/TourRoute/TourRouteRepo';
import schema from './schema';
import { BadRequestResponse, SuccessResponse } from '../../../core/ApiResponse';
import WatchTable from '../../../helpers/realtime/WatchTable';
import TouristsRouteModel, {
  TouristsRoute,
} from '../../../database/model/Company/TouristsRoute';
import Logger from '../../../core/Logger';

export async function handleViewTouristRoute(socket: Socket) {
  handleViewRecommendTouristRoute(socket);
  handleViewTouristRouteById(socket);
  handleViewTouristRouteByFilter(socket);
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
      socketValidator(schema.viewTour.byId),
      async ({ id }: { id: string }) => {
        WatchTable.register(TouristsRouteModel)
          .filter((data: TouristsRoute) => data._id.toString() === id)
          .do((data) => {
            new SuccessResponse('update route', data).sendSocket(
              socket,
              SocketServerMessage.ROUTE,
            );
          });
        try {
          const touristRoute = await TourRouteRepo.findById(id);

          return new SuccessResponse(
            'successfully retrieve tourist route',
            touristRoute,
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
      socketValidator(schema.viewTour.byFilter),
      async ({ route, keyword }: { route: string[]; keyword: string }) => {
        WatchTable.register(TouristsRouteModel)
          .filter(
            (data: TouristsRoute) =>
              route.every((place) => data.route.includes(place)) &&
              data.name.search(keyword) !== -1,
          )
          .do((data) => {
            Logger.debug('new route');
            new SuccessResponse('new route', data).sendSocket(
              socket,
              SocketServerMessage.NEW_ROUTE,
            );
          });
        const touristRoutes = await TourRouteRepo.filter({ route, keyword });

        return new SuccessResponse(
          'successfully retrieve tourist route',
          touristRoutes,
        ).sendSocket(socket, SocketServerMessage.RETRIEVE_TOURIST_ROUTES);
      },
    ),
  );
}
