import { Socket } from 'socket.io';
import { InternalError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { Staff, StaffModel } from '../../database/model/Company/Staff';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import WatchTable from '../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';

export async function handleViewStaffInformation(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_STAFF_INFO,
    socketAsyncHandler(socket, async () => {
      const staffId = socket.data.staff._id;

      const listener = WatchTable.register(StaffModel, socket)
        .filter((data: Staff) => data._id == staffId)
        .do((data, listenerId) => {
          new SuccessResponse(
            'update staff information',
            data,
            listenerId,
          ).sendSocket(socket, SocketServerMessage.STAFF_INFO);
        });
      try {
        const staff = await StaffRepo.findById(staffId);

        return new SuccessResponse(
          'successfully retrieve staff information',
          staff,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.STAFF_INFO);
      } catch (e) {
        throw new InternalError('Invalid staff');
      }
    }),
  );
}
