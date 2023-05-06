import { Socket } from 'socket.io';
import { InternalError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel from '../../database/model/Company/Company';
import { Staff } from '../../database/model/Company/Staff';
import CompanyRepo from '../../database/repository/Company/CompanyRepo/CompanyRepo';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import WatchTable from '../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';

export async function handleViewCompanyInformation(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_COMPANY_INFO,
    socketAsyncHandler(socket, async () => {
      try {
        const staffId = socket.data.staff._id;
        const staff = await StaffRepo.findById(staffId);
        const company = await CompanyRepo.findById({
          id: staff?.companyId || '',
        });
        if (!company)
          throw new InternalError('Staff does not belong to any company');

        const listener = WatchTable.register(CompanyModel, socket)
          .filter(
            (data: Staff) => data._id.toString() == company._id?.toString(),
          )
          .do((data, listenerId) => {
            new SuccessResponse('update staff information', data, listenerId).sendSocket(
              socket,
              SocketServerMessage.COMPANY_INFO,
            );
          });

        return new SuccessResponse(
          'successfully retrieve tour',
          company,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.COMPANY_INFO);
      } catch (e) {
        throw new InternalError('Staff does not belong to any company');
      }
    }),
  );
}
