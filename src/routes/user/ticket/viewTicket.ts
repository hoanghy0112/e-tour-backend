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
import { BadRequestError } from '../../../core/ApiError';
import TicketModel, { ITicket } from '../../../database/model/User/Ticket';

export async function handleViewTicketList(socket: Socket) {
  // socket.on(
  //   SocketClientMessage.VIEW_TOUR,
  //   socketAsyncHandler(
  //     socket,
  //     socketValidator(schema.viewTicketList),
  //     async ({ num }: { num: number }) => {
  //       WatchTable.register(TicketModel)
  //         .filter((data: ITicket) => data._id.toString() === id)
  //         .do((data) => {
  //           new SuccessResponse('update tour', data).sendSocket(
  //             socket,
  //             SocketServerMessage.TOUR,
  //           );
  //         });
  //       try {
  //         const tour = await TourRepo.findById(id);
  //         return new SuccessResponse(
  //           'successfully retrieve tour',
  //           tour,
  //         ).sendSocket(socket, SocketServerMessage.TOUR);
  //       } catch (e) {
  //         throw new BadRequestError('Tour not found');
  //       }
  //     },
  //   ),
  // );
}
