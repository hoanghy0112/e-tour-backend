import { Socket } from 'socket.io';
import { SuccessResponse } from '../../../core/ApiResponse';
import CompanyModel, {
  IFollower,
  NotificationType,
} from '../../../database/model/Company/Company';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';
import UserModel, { INotification } from '../../../database/model/User/User';
import WatchTable from '../../../helpers/realtime/WatchTable';
import { Types } from 'mongoose';
import handleSocketAPI from '../../../helpers/handleSocketAPI';
import NotificationRepo from '../../../database/repository/NotificationRepo';
import { uploadImageToS3 } from '../../../database/s3';

export default function handlePushNotification(socket: Socket) {
  handlePushNotificationToTourCustomer(socket);
}

export function handlePushNotificationToTourCustomer(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.notification.PUSH_TO_TOUR_CUSTOMER,
    schema: schema.pushNotificationToTourCustomer,
    handler: async ({
      tourId,
      type,
      notification,
    }: {
      tourId: string;
      type: NotificationType;
      notification: INotification;
    }) => {
      let imageName;
      // @ts-ignore
      if (notification?.image?.originalname) {
        // @ts-ignore
        imageName = await uploadImageToS3(notification?.image);
      }

      const customers = await NotificationRepo.sendToTourCustomer(
        tourId,
        type,
        {
          ...notification,
          ...(notification?.image ? { image: imageName } : {}),
        },
      );

      return new SuccessResponse('Success', customers).sendSocket(
        socket,
        SocketServerMessage.notification.PUSH_TO_TOUR_CUSTOMER_RESULT,
      );
    },
  });
}
