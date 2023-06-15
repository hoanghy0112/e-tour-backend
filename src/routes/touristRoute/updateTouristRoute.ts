import { Socket } from 'socket.io';
import socketAuthorization from '../../auth/socketAuthorization';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import { StaffPermission } from '../../database/model/Company/Staff';
import { ITouristsRoute } from '../../database/model/Company/TouristsRoute';
import TourRouteRepo from '../../database/repository/Company/TourRoute/TourRouteRepo';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import socketValidator from '../../helpers/socketValidator';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import schema from './schema';
import { uploadImageToS3, uploadImageToS3FromURL } from '../../database/s3';

function isValidHttpUrl(s: string) {
  let url;

  try {
    url = new URL(s);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export async function handleChangeTourRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.EDIT_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.editTourRoute),
      socketAuthorization([StaffPermission.EDIT_ROUTE]),
      async (tourRoute: ITouristsRoute) => {
        const { _id, images, ...data } = tourRoute;

        const updatedImages =
          (await Promise.all(
            (images || []).map(async (image) =>
              typeof image != 'string'
                ? await uploadImageToS3(image as any)
                : isValidHttpUrl(image)
                ? await uploadImageToS3FromURL(image)
                : image,
            ),
          )) || [];

        try {
          const touristRoute = await TourRouteRepo.edit(_id, {
            ...(images ? { images: updatedImages } : {}),
            ...data,
          } as ITouristsRoute);

          return new SuccessResponse(
            'Update tourist route successfully',
            touristRoute,
          ).sendSocket(socket, SocketServerMessage.EDIT_ROUTE_RESULT);
        } catch (e) {
          return new BadRequestResponse('Update tourist route fail').sendSocket(
            socket,
            SocketServerMessage.ERROR,
          );
        }
      },
    ),
  );
}
