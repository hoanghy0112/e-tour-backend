import { Socket } from 'socket.io';
import { BadRequestError, ForbiddenError } from '../../../core/ApiError';
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
import handleSocketAPI from '../../../helpers/handleSocketAPI';
import authorization from '../../../auth/authorization';
import { StaffPermission } from '../../../database/model/Company/Staff';
import TouristsRouteModel, {
  ITouristsRoute,
} from '../../../database/model/Company/TouristsRoute';

export async function handleViewTour(socket: Socket) {
  handleViewRecommendTour(socket);
  handleViewTourById(socket);
  handleViewTourByFilter(socket);
}

async function handleViewRecommendTour(socket: Socket) {
  //
}

async function handleViewTourById(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.VIEW_TOUR,
    serverEvent: SocketServerMessage.TOUR,
    schema: schema.viewTour.byId,
    handler: async ({ id }: { id: string }) => {
      if (socket.data.staff) {
        // authorization([StaffPermission.VIEW_TOUR]);
        const companyId = socket.data.staff.companyId;
        const tour = await TourModel.findById(id).populate('touristRoute');
        //@ts-ignore
        if (tour?.touristRoute?.companyId.toString() != companyId.toString())
          throw new ForbiddenError('This tour is belong to another company');
      }

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
    },
  });
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
        let tours = await TourRepo.filter({ touristRoute, from, to });
        const listener = WatchTable.register(TourModel, socket)
          .filter((data: ITour, id) => {
            return (
              tours.some((tour) => tour._id?.toString() == id.toString()) ||
              (touristRoute
                ? data.touristRoute.toString() == touristRoute
                : true)
            );
          })
          .do(async (data, listenerId) => {
            tours = await TourRepo.filter({ touristRoute, from, to });

            return new SuccessResponse(
              'successfully retrieve tour',
              tours,
              listener.getId(),
            ).sendSocket(socket, SocketServerMessage.LIST_TOUR);
          });

        return new SuccessResponse(
          'successfully retrieve tour',
          tours,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.LIST_TOUR);
      },
    ),
  );
}

export async function handleViewTourOfCompany(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.TOUR.VIEW_COMPANY_TOUR,
    serverEvent: SocketServerMessage.TOUR_EVENTS.COMPANY_TOUR,
    schema: schema.viewTour.ofCompany,
    handler: async ({ companyId }: { companyId: string }) => {
      const touristRoutes = await TouristsRouteModel.find({ companyId });
      const tours = await TourModel.find({
        touristRoute: { $in: touristRoutes.map((d) => d._id) },
      });

      return new SuccessResponse(
        'successfully retrieve tourist route',
        tours,
      ).sendSocket(socket, SocketServerMessage.TOUR_EVENTS.COMPANY_TOUR);
    },
  });
}
