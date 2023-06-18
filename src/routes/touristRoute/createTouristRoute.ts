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
import handleSocketAPI from '../../helpers/handleSocketAPI';

export async function handleCreateTourRoute(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.touristRoute.CREATE_ROUTE,
    serverEvent: SocketServerMessage.touristRoute.CREATE_ROUTE_RESULT,
    schema: schema.createTourRoute,
    permissions: [StaffPermission.EDIT_ROUTE],
    handler: async (tourRoute: ITouristsRoute) => {
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
      ).sendSocket(
        socket,
        SocketServerMessage.touristRoute.CREATE_ROUTE_RESULT,
      );
    },
  });
}
