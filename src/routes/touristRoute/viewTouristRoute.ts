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
import { ForbiddenError } from '../../core/ApiError';
import handleSocketAPI from '../../helpers/handleSocketAPI';

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
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.VIEW_ROUTE,
    serverEvent: SocketServerMessage.ROUTE,
    schema: schema.viewTouristRoute.byId,
    handler: async ({ id }: { id: string }) => {
      if (socket.data.staff) {
        const companyId = socket.data.staff.companyId;
        const route = await TouristsRouteModel.findById(id);
        //@ts-ignore
        if (route?.companyId.toString() != companyId.toString())
          throw new ForbiddenError('This route is belong to another company');
      }

      const listener = WatchTable.register(TouristsRouteModel, socket)
        .filter((data: ITouristsRoute) => data._id.toString() === id)
        .do(async (data, listenerId) => {
          const touristRoute = await TourRouteRepo.findById(
            id,
            socket.data?.user?._id.toString(),
          );
          new SuccessResponse(
            'update route',
            touristRoute,
            listenerId,
          ).sendSocket(socket, SocketServerMessage.ROUTE);
        });

      const touristRoute = await TourRouteRepo.findById(
        id,
        socket.data?.user?._id.toString(),
      );

      return new SuccessResponse(
        'successfully retrieve tourist route',
        touristRoute,
        listener.getId(),
      ).sendSocket(socket, SocketServerMessage.ROUTE);
    },
  });
}

async function handleViewTouristRouteByFilter(socket: Socket) {
  socket.on(
    SocketClientMessage.FILTER_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewTouristRoute.byFilter),
      async ({ route, keyword }: { route: string[]; keyword: string }) => {
        let touristRoutes = await TourRouteRepo.filter({ route, keyword });
        const listener = WatchTable.register(TouristsRouteModel, socket)
          .filter((data: ITouristsRoute, documentId) => {
            return (
              touristRoutes.some((route) => route._id == documentId) ||
              (route.every((place) => data.route.includes(place)) &&
                data.name.search(keyword) !== -1)
            );
          })
          .do(async (data, listenerId) => {
            touristRoutes = await TourRouteRepo.filter({ route, keyword });
            new SuccessResponse(
              'new route',
              touristRoutes,
              listenerId,
            ).sendSocket(socket, SocketServerMessage.RETRIEVE_TOURIST_ROUTES);
          });

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

export async function handleViewTouristRouteOfCompany(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.touristRoute.VIEW_COMPANY_ROUTE,
    serverEvent: SocketServerMessage.touristRoute.COMPANY_ROUTE,
    handler: async () => {
      const companyId = socket.data.staff.companyId;
      let touristRoutes = await TouristsRouteModel.find({ companyId });

      const listener = WatchTable.register(TouristsRouteModel, socket)
        .filter((data: ITouristsRoute, documentId) => {
          return (
            touristRoutes.some(
              (route) => route._id.toString() == documentId.toString(),
            ) || data.companyId.toString() == companyId
          );
        })
        .do(async (data, listenerId) => {
          touristRoutes = await TouristsRouteModel.find({ companyId });
          new SuccessResponse(
            'new route',
            touristRoutes,
            listenerId,
          ).sendSocket(socket, SocketServerMessage.touristRoute.COMPANY_ROUTE);
        });

      return new SuccessResponse(
        'successfully retrieve tourist route',
        touristRoutes,
        listener.getId(),
      ).sendSocket(socket, SocketServerMessage.touristRoute.COMPANY_ROUTE);
    },
  });
}
