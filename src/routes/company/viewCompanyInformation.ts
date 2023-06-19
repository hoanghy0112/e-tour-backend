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
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';

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
          .filter((data: Staff, id) => {
            console.log({ data, id, iid: staff?.companyId.toString() });
            return id == staff?.companyId.toString();
          })
          .do(async (data, listenerId) => {
            const company = await CompanyModel.findById(staff?.companyId);

            new SuccessResponse(
              'update staff information',
              company,
              listenerId,
            ).sendSocket(socket, SocketServerMessage.COMPANY_INFO);
          });

        return new SuccessResponse(
          'successfully retrieve company information',
          company,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.COMPANY_INFO);
      } catch (e) {
        throw new InternalError('Staff does not belong to any company');
      }
    }),
  );
}

export const viewCompanyInformation = asyncHandler(
  async (req: PublicRequest, res) => {
    const { companyId } = req.params;

    const company = await CompanyRepo.findById({ id: companyId });

    return new SuccessResponse('Success', company).send(res);
  },
);
