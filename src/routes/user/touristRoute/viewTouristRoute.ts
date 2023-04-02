import { Socket } from 'socket.io';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import TourRouteRepo from '../../../database/repository/Company/TourRoute/TourRouteRepo';
import schema from './schema';
import { SuccessResponse } from '../../../core/ApiResponse';
import WatchTable from '../../../helpers/realtime/WatchTable';
import TouristsRouteModel, {
  TouristsRoute,
} from '../../../database/model/Company/TouristsRoute';
import Logger from '../../../core/Logger';

export async function handleViewTouristRoute(socket: Socket) {
  handleViewRecommendTouristRoute(socket);
  handleViewTouristRouteByFilter(socket);
}

async function handleViewRecommendTouristRoute(socket: Socket) {
  //
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
            (data: TouristsRoute) => {
              console.log('new data');
              return true;
            },
            // route.every((place) => data.route.includes(place)) &&
            // data.name.search(keyword) !== -1,
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
