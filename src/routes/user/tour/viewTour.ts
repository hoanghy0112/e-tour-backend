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
import TourModel, { ITour } from '../../../database/model/Company/Tour';
import TourRepo from '../../../database/repository/Company/TourRepo/TourRepo';
import { BadRequestError } from '../../../core/ApiError';

export async function handleViewTour(socket: Socket) {
  handleViewRecommendTour(socket);
  handleViewTourById(socket);
  handleViewTourByFilter(socket);
}

async function handleViewRecommendTour(socket: Socket) {
  //
}

async function handleViewTourById(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_TOUR,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewTour.byId),
      async ({ id }: { id: string }) => {
        WatchTable.register(TourModel)
          .filter((data: ITour) => data._id.toString() === id)
          .do((data) => {
            new SuccessResponse('update tour', data).sendSocket(
              socket,
              SocketServerMessage.TOUR,
            );
          });
        try {
          const tour = await TourRepo.findById(id);

          return new SuccessResponse(
            'successfully retrieve tour',
            tour,
          ).sendSocket(socket, SocketServerMessage.TOUR);
        } catch (e) {
          throw new BadRequestError('Tour not found');
        }
      },
    ),
  );
}

async function handleViewTourByFilter(socket: Socket) {
  socket.on(
    SocketClientMessage.FILTER_TOUR,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewTour.byFilter),
      async ({
        touristRoute,
        from,
        to,
      }: {
        touristRoute: string;
        from: Date;
        to: Date;
      }) => {
        WatchTable.register(TourModel)
          .filter((data: ITour) =>
            touristRoute ? data.touristRoute.toString() == touristRoute : true,
          )
          .filter((data: ITour) => (from ? data.from > from : true))
          .filter((data: ITour) => (to ? data.to < to : true))
          .do((data) => {
            new SuccessResponse('update tour filter', data).sendSocket(
              socket,
              SocketServerMessage.TOUR,
            );
          });
        try {
          const tour = await TourRepo.filter({ touristRoute, from, to });

          return new SuccessResponse(
            'successfully retrieve tour',
            tour,
          ).sendSocket(socket, SocketServerMessage.LIST_TOUR);
        } catch (e) {
          return new BadRequestResponse('Invalid tourist route').sendSocket(
            socket,
            SocketServerMessage.ERROR,
          );
        }
      },
    ),
  );
}
