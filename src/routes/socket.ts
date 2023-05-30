import { Socket } from 'socket.io';
import { BadRequestError } from '../core/ApiError';
import { SuccessResponse } from '../core/ApiResponse';
import socketAsyncHandler from '../helpers/socketAsyncHandler';
import Logger from '../core/Logger';
import { SocketClientMessage, SocketServerMessage } from '../types/socket';
import handleTourRouteSocket from './company/tourRoute';
import { handleViewTouristRoute } from './user/touristRoute/viewTouristRoute';
import handleTourSocket from './company/tour';
import { handleViewTour } from './user/tour/viewTour';
import { handleViewStaffInformation } from './company/staffInformation';
import { handleViewCompanyInformation } from './company/viewCompanyInformation';
import { handleViewUserProfile } from './user/access/profile';
import { handleBookTicket } from './user/ticket/bookTicket';
import { handleViewTicketList } from './user/ticket/viewTicketList';
import { handleCreateRate } from './user/rating/createRate';
import { handleViewRate } from './user/rating/viewRate';
import { handleRemoveListener } from './socketManager/removeListener';
import { handleTestWatchTable } from './socketManager/testWatchTable';
import handleManageSavedTouristRoute from './user/touristRoute/saveTouristRoute';
import { handleViewVoucher } from './user/voucher/viewVoucher';
import handleVoucherSocket from './company/voucher';
import handleContactCompany from './user/contactCompany/contactCompany';
import {
  handleFollowTouristRoute,
  handleUnFollowTouristRoute,
} from './user/touristRoute/followTouristRoute';
import handleNotification from './user/notification/notification';
import handleTicket from './user/ticket';

export default function socketRouter(socket: Socket) {
  handleTourSocket(socket);
  handleViewTour(socket);
  handleTourRouteSocket(socket);
  handleViewTouristRoute(socket);
  handleViewStaffInformation(socket);
  handleViewCompanyInformation(socket);
  handleViewUserProfile(socket);
  handleCreateRate(socket);
  handleViewRate(socket);
  handleRemoveListener(socket);
  handleTestWatchTable(socket);
  handleManageSavedTouristRoute(socket);
  handleViewVoucher(socket);
  handleVoucherSocket(socket);
  handleContactCompany(socket);
  handleFollowTouristRoute(socket);
  handleUnFollowTouristRoute(socket);
  handleNotification(socket);

  handleTicket(socket);

  socket.on(
    SocketClientMessage.PING,
    socketAsyncHandler(socket, async (data: { text: string }) => {
      // For test
      if (data.text !== 'OK') throw new BadRequestError('Text data is not ok');
      return new SuccessResponse('connection is ok', {
        text: 'Yes',
        data: socket.data,
      }).sendSocket(socket);
    }),
  );
}
