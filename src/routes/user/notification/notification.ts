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
import UserModel from '../../../database/model/User/User';
import WatchTable from '../../../helpers/realtime/WatchTable';

export default function handleNotification(socket: Socket) {
  handleViewNewNotification(socket);
  handleReadNotification(socket);
}

function handleViewNewNotification(socket: Socket) {
  socket.on(
    SocketClientMessage.notification.VIEW_NEW_NOTIFICATION,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewNewNotification),
      async ({}) => {
        const userId = socket.data.user._id;

        const notifications =
          (await UserModel.findById(userId).populate('notifications'))
            ?.notifications || [];

        const listener = WatchTable.register(UserModel, socket)
          .filter((data, id) => id.toString() === userId.toString())
          .do(async (data, listenerId) => {
            const notifications =
              (await UserModel.findById(userId).populate('notifications'))
                ?.notifications || [];

            return new SuccessResponse(
              'Successfully retrieve notifications',
              notifications,
              listenerId,
            ).sendSocket(
              socket,
              SocketServerMessage.notification.NEW_NOTIFICATION_LIST,
            );
          });

        return new SuccessResponse(
          'Successfully retrieve notifications',
          notifications,
          listener.getId(),
        ).sendSocket(
          socket,
          SocketServerMessage.notification.NEW_NOTIFICATION_LIST,
        );
      },
    ),
  );
}

function handleReadNotification(socket: Socket) {
  socket.on(
    SocketClientMessage.notification.READ_NOTIFICATION,
    socketAsyncHandler(
      socket,
      socketValidator(schema.readNotification),
      async ({ notificationIDs }: { notificationIDs: string[] }) => {
        const userId = socket.data.user._id;

        await UserModel.updateMany(
          { _id: userId, 'notifications._id': { $in: notificationIDs } },
          {
            $set: {
              'notifications.$.isRead': true,
            },
          },
        );

        return new SuccessResponse(
          'Successfully read notifications',
          {},
        ).sendSocket(
          socket,
          SocketServerMessage.notification.READ_NOTIFICATION_RESULT,
        );
      },
    ),
  );
}
