import { Socket } from 'socket.io';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import TourRouteRepo from '../../../database/repository/Company/TourRoute/TourRouteRepo';
import schema from './schema';
import { BadRequestResponse, SuccessResponse } from '../../../core/ApiResponse';
import WatchTable from '../../../helpers/realtime/WatchTable';
import TouristsRouteModel, {
  TouristsRoute,
} from '../../../database/model/Company/TouristsRoute';
import Logger from '../../../core/Logger';
import TourModel, { ITour } from '../../../database/model/Company/Tour';
import TourRepo from '../../../database/repository/Company/TourRepo/TourRepo';
import { BadRequestError, InternalError } from '../../../core/ApiError';
import RateModel, { IRate, RateType } from '../../../database/model/User/Rate';
import RateRepo from '../../../database/repository/User/RateRepo';
import { RateError, RateErrorType } from '../../../database/error/Rate';
import TicketRepo from '../../../database/repository/User/TicketRepo';

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

          const customerTicketOfRoute = await TicketRepo.

          const rate = await RateRepo.create(rateInfo);

          WatchTable.register(RateModel)
            .filter(
              (data: IRate) => data._id?.toString() === rate._id?.toString(),
            )
            .do((data) => {
              new SuccessResponse('Updated rate', data).sendSocket(
                socket,
                SocketServerMessage.UPDATED_RATE,
              );
            });

          return new SuccessResponse(
            'successfully create rate',
            rate,
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
