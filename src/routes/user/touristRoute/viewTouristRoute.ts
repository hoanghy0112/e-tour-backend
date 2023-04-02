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

export async function handleViewTouristRoute(socket: Socket) {
  handleViewRecommendTouristRoute(socket);
  handleViewTouristRouteByFilter(socket);
}

async function handleViewRecommendTouristRoute(socket: Socket) {
  //
}

async function handleViewTouristRouteByFilter(socket: Socket) {
  socket.on(
    SocketClientMessage.CREATE_COMPANY,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewTour.byFilter),
      async ({ route, keyword }: { route: string[]; keyword: string }) => {
        const touristRoutes = await TourRouteRepo.filter({ route, keyword });

        return new SuccessResponse(
          'successfully retrieve tourist route',
          touristRoutes,
        ).sendSocket(socket, SocketServerMessage.RETRIEVE_TOURIST_ROUTE);
      },
    ),
  );
}
