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

export default function handleContactCompany(socket: Socket) {
  handleFollowCompany(socket);
}

function handleFollowCompany(socket: Socket) {
  socket.on(
    SocketClientMessage.contactCompany.FOLLOW_COMPANY,
    socketAsyncHandler(
      socket,
      socketValidator(schema.followCompany),
      async ({
        companyId,
        notificationType = NotificationType.ALL,
      }: {
        companyId: string;
        notificationType: string;
      }) => {
        const userId = socket.data.user;

        await CompanyModel.findByIdAndUpdate(companyId, {
          $addToSet: {
            followers: {
              user: userId,
              notificationType,
            } as IFollower,
          },
        });

        return new SuccessResponse(
          'successfully follow company',
          {},
        ).sendSocket(
          socket,
          SocketServerMessage.contactCompany.FOLLOW_COMPANY_RESULT,
        );
      },
    ),
  );
}
