import { Socket } from 'socket.io';
import { SuccessResponse } from '../../../core/ApiResponse';
import CompanyModel from '../../../database/model/Company/Company';
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
      async ({ companyId }: { companyId: string }) => {
        const userId = socket.data.user;

        await CompanyModel.findByIdAndUpdate(companyId, {
          $addToSet: {
            followers: userId,
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