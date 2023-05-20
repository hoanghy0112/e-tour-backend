import { Socket } from 'socket.io';
import { Types } from 'mongoose';
import { BadRequestError, InternalError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import { RateError, RateErrorType } from '../../../database/error/Rate';
import RateModel, { IRate } from '../../../database/model/User/Rate';
import RateRepo from '../../../database/repository/User/RateRepo';
import WatchTable from '../../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';
import CompanyModel from '../../../database/model/Company/Company';

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
        ).sendSocket(socket, SocketServerMessage.RATE_OF_ROUTE);
      },
    ),
  );
}
