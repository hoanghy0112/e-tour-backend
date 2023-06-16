import { Socket } from 'socket.io';
import { BadRequestError } from '../../../core/ApiError';
import { BadRequestResponse, SuccessResponse } from '../../../core/ApiResponse';
import TourModel, { ITour } from '../../../database/model/Company/Tour';
import TourRepo from '../../../database/repository/Company/TourRepo/TourRepo';
import WatchTable from '../../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';

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
        try {
          const tour = await TourRepo.findById(id);

          const listener = WatchTable.register(TourModel, socket)
            .filter((data: ITour) => data?._id?.toString() === id)
            .do((data, listenerId) => {
              new SuccessResponse('update tour', data, listenerId).sendSocket(
                socket,
                SocketServerMessage.TOUR,
              );
            });

          return new SuccessResponse(
            'successfully retrieve tour',
            tour,
            listener.getId(),
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
        const listener = WatchTable.register(TourModel, socket)
          .filter((data: ITour) =>
            touristRoute ? data.touristRoute.toString() == touristRoute : true,
          )
          .do(async (data, listenerId) => {
            const tours = await TourRepo.filter({ touristRoute, from, to });

            return new SuccessResponse(
              'successfully retrieve tour',
              tours,
              listener.getId(),
            ).sendSocket(socket, SocketServerMessage.LIST_TOUR);
          });
        try {
          const tour = await TourRepo.filter({ touristRoute, from, to });

          return new SuccessResponse(
            'successfully retrieve tour',
            tour,
            listener.getId(),
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
