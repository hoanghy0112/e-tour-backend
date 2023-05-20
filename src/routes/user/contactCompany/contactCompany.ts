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
        try {
          const rateList = await RateRepo.getDetailRatingOfRoute(id);

          const rateMap = new Map();
          rateList.forEach((rating: IRate) => {
            rateMap.set(rating._id, rating);
          });

          const listener = WatchTable.register(RateModel, socket)
            .filter(
              (data: IRate, id) =>
                rateMap.has(id) ||
                data?.touristsRouteId?._id?.toString() === id?.toString(),
            )
            .do((data: IRate, listenerId, id) => {
              if (data == null) rateMap.delete(id);
              else rateMap.set(data._id, data);

              new SuccessResponse(
                'Updated rate list',
                rateMap.values(),
                listenerId,
              ).sendSocket(socket, SocketServerMessage.RATE_OF_ROUTE);
            });

          return new SuccessResponse(
            'successfully retrieve rate of route',
            rateList,
            listener.getId(),
          ).sendSocket(socket, SocketServerMessage.RATE_OF_ROUTE);
        } catch (e: any) {
          if (e instanceof RateError) {
            if (e.type == RateErrorType.RATE_NOT_FOUND)
              throw new BadRequestError('Rate not found');
          } else if (e instanceof BadRequestError) throw e;
          else throw new InternalError(`${e?.message} - ${e?.stack}`);
        }
      },
    ),
  );
}
