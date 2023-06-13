import { Socket } from 'socket.io';
import socketAuthorization from '../../auth/socketAuthorization';
import { BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { StaffPermission } from '../../database/model/Company/Staff';
import { ITouristsRoute } from '../../database/model/Company/TouristsRoute';
import TourRouteRepo from '../../database/repository/Company/TourRoute/TourRouteRepo';
import { uploadImageToS3 } from '../../database/s3';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from './schema';

export async function handleCreateTourRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.CREATE_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.createTourRoute),
      socketAuthorization([StaffPermission.EDIT_ROUTE]),
      async (tourRoute: ITouristsRoute) => {
        tourRoute.images =
          (await Promise.all(
            (tourRoute.images || []).map(
              async (image) => (await uploadImageToS3(image as any)) || '',
            ),
          )) || [];

        const companyId = socket.data.staff.companyId;
        const data = { ...tourRoute, companyId };
        const listRoute = await TourRouteRepo.list(companyId);
        if (listRoute?.find((v) => v.name === tourRoute.name))
          throw new BadRequestError('Route name exists');

        TourRouteRepo.create(data);

        return new SuccessResponse(
          'Create tourist route successfully',
          data,
        ).sendSocket(socket, SocketServerMessage.CREATE_ROUTE_RESULT);
      },
    ),
  );
}
