import { Socket } from 'socket.io';
import { StaffPermission } from '../database/model/Company/Staff';
import { BadRequestError, ForbiddenError } from '../core/ApiError';
import Logger from '../core/Logger';

const socketAuthorization =
  (permissions: StaffPermission[]) => (socket: Socket) => {
    const staff = socket.data?.staff;
    if (!staff) throw new BadRequestError('User is not a staff');
    const staffPermissions: string[] = staff.permissions || [];
    if (
      !permissions.every((permission) => staffPermissions.includes(permission))
    )
      throw new ForbiddenError('You do not have enough permission');
  };

export default socketAuthorization;
