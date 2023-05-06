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

export async function handleCreateRate(socket: Socket) {
  socket.on(
    SocketClientMessage.CREATE_RATE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.createRate),
      async (rateInfo: IRate) => {
        try {
          if (rateInfo.companyId) rateInfo.rateType = RateType.COMPANY;
          else if (rateInfo.touristsRouteId) rateInfo.rateType = RateType.ROUTE;
          else if (rateInfo.staffId) rateInfo.rateType = RateType.STAFF;
          else
            throw new BadRequestError(
              'touristsRouteId | companyId | staffId must not be empty',
            );

          if (
            rateInfo.touristsRouteId &&
            !TicketRepo.haveCustomerVisitRoute({
              userId: socket.data?.user._id,
              routeId: rateInfo?.touristsRouteId,
            })
          )
            throw new BadRequestError('User has not visit this route');

          rateInfo.userId = socket.data?.user._id;
          const rate = await RateRepo.create(rateInfo);

          const listener = WatchTable.register(RateModel, socket)
            .filter(
              (data: IRate) => data._id?.toString() === rate._id?.toString(),
            )
            .do((data, listenerId) => {
              new SuccessResponse('Updated rate', data, listenerId).sendSocket(
                socket,
                SocketServerMessage.UPDATED_RATE,
              );
            });

          return new SuccessResponse(
            'successfully create rate',
            rate,
            listener.getId(),
          ).sendSocket(socket, SocketServerMessage.CREATE_RATE_RESULT);
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
