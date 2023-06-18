import { Socket } from 'socket.io';
import { BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { StaffPermission } from '../../database/model/Company/Staff';
import { ITouristsRoute } from '../../database/model/Company/TouristsRoute';
import TourRouteRepo from '../../database/repository/Company/TourRoute/TourRouteRepo';
import { uploadImageToS3 } from '../../database/s3';
import handleSocketAPI from '../../helpers/handleSocketAPI';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from './schema';

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

      const touristRoute = await TourRouteRepo.create(data);

      return new SuccessResponse(
        'Create tourist route successfully',
        touristRoute,
      ).sendSocket(
        socket,
        SocketServerMessage.touristRoute.CREATE_ROUTE_RESULT,
      );
    },
  });
}
