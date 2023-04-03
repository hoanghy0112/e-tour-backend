import { Socket } from 'socket.io';
import schema from './schema';
import { SocketClientMessage, SocketServerMessage } from '../../types/socket';
import socketAsyncHandler from '../../helpers/socketAsyncHandler';
import WatchTable from '../../helpers/realtime/WatchTable';
import { Staff, StaffModel } from '../../database/model/Company/Staff';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import CompanyRepo from '../../database/repository/Company/CompanyRepo/CompanyRepo';
import CompanyModel from '../../database/model/Company/Company';
import { BadRequestError, InternalError } from '../../core/ApiError';

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

        WatchTable.register(CompanyModel)
          .filter(
            (data: Staff) => data._id.toString() == company._id?.toString(),
          )
          .do((data) => {
            new SuccessResponse('update staff information', data).sendSocket(
              socket,
              SocketServerMessage.COMPANY_INFO,
            );
          });

        return new SuccessResponse(
          'successfully retrieve tour',
          company,
        ).sendSocket(socket, SocketServerMessage.COMPANY_INFO);
      } catch (e) {
        throw new InternalError('Staff does not belong to any company');
      }
    }),
  );
}
