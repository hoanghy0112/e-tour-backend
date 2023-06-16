import { Socket } from 'socket.io';
import { BadRequestError } from '../core/ApiError';
import { SuccessResponse } from '../core/ApiResponse';
import socketAsyncHandler from '../helpers/socketAsyncHandler';
import { SocketClientMessage } from '../types/socket';
import { handleViewStaffInformation } from './company/staffInformation';
import { handleViewCompanyInformation } from './company/viewCompanyInformation';
import { handleRemoveListener } from './socketManager/removeListener';
import { handleTestWatchTable } from './socketManager/testWatchTable';
import { handleTouristRoute } from './touristRoute';
import handleManageSavedTouristRoute from './touristRoute/saveTouristRoute';
import { handleViewUserProfile } from './user/access/profile';
import handleChat from './user/chat';
import handleContactCompany from './user/contactCompany/contactCompany';
import handleNotification from './user/notification';
import { handleCreateRate } from './user/rating/createRate';
import { handleViewRate } from './user/rating/viewRate';
import handleTicket from './user/ticket';
import handleTour from './user/tour';
import { handleVoucher } from './voucher';

export default function socketRouter(socket: Socket) {
  handleViewStaffInformation(socket);
  handleViewCompanyInformation(socket);
  handleViewUserProfile(socket);
  handleCreateRate(socket);
  handleViewRate(socket);
  handleRemoveListener(socket);
  handleTestWatchTable(socket);
  handleManageSavedTouristRoute(socket);
  handleContactCompany(socket);
  handleNotification(socket);

  handleTour(socket);
  handleTouristRoute(socket);
  handleVoucher(socket);
  handleTicket(socket);
  handleChat(socket);

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
