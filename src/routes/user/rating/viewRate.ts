import { Types } from 'mongoose';
import { Socket } from 'socket.io';
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

export async function handleViewRate(socket: Socket) {
  handleViewRateOfRoute(socket);
}

async function handleViewRateOfRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_RATE_OF_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewRateOfRoute),
      async ({ id }: { id: string | Types.ObjectId }) => {
        try {
          const rateList = await RateRepo.getDetailRatingOfRoute(id);

          const listener = WatchTable.register(RateModel, socket)
            .filter(
              (data: IRate) =>
                data.touristsRouteId?._id?.toString() === id?.toString(),
            )
            .do((data, listenerId) => {
              new SuccessResponse('Updated rate list', data, listenerId).sendSocket(
                socket,
                SocketServerMessage.RATE_OF_ROUTE,
              );
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
