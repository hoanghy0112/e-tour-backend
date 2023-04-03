import { Socket } from 'socket.io';
import schema from './schema';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import WatchTable from '../../helpers/realtime/WatchTable';
import { Staff, StaffModel } from '../../database/model/Company/Staff';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import { InternalError } from '../../core/ApiError';

export async function handleViewStaffInformation(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_STAFF_INFO,
    socketAsyncHandler(socket, async () => {
      const staffId = socket.data.staff._id;

      WatchTable.register(StaffModel)
        .filter((data: Staff) => data._id == staffId)
        .do((data) => {
          new SuccessResponse('update staff information', data).sendSocket(
            socket,
            SocketServerMessage.STAFF_INFO,
          );
        });
      try {
        const staff = await StaffRepo.findById(staffId);

        return new SuccessResponse(
          'successfully retrieve staff information',
          staff,
        ).sendSocket(socket, SocketServerMessage.STAFF_INFO);
      } catch (e) {
        throw new InternalError('Invalid staff');
      }
    }),
  );
}
