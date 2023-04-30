import { Socket } from 'socket.io';
import { BadRequestError, InternalError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import { RateError, RateErrorType } from '../../../database/error/Rate';
import RateModel, { IRate, RateType } from '../../../database/model/User/Rate';
import RateRepo from '../../../database/repository/User/RateRepo';
import TicketRepo from '../../../database/repository/User/TicketRepo';
import WatchTable from '../../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';
import { Types } from 'mongoose';

export async function handleViewRate(socket: Socket) {
  handleViewRateOfRoute(socket);
}

async function handleViewRateOfRoute(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_RATE_OF_ROUTE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewRateOfRoute),
      async (id: string | Types.ObjectId) => {
        try {
          const rateList = await RateRepo.getDetailRatingOfRoute(id);

          WatchTable.register(RateModel)
            .filter(
              (data: IRate) =>
                data.touristsRouteId?._id?.toString() === id?.toString(),
            )
            .do((data) => {
              new SuccessResponse('Updated rate list', data).sendSocket(
                socket,
                SocketServerMessage.RATE_OF_ROUTE,
              );
            });

          return new SuccessResponse(
            'successfully retrieve rate of route',
            rateList,
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
