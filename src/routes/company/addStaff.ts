import { SuccessResponse } from '../../core/ApiResponse';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const addStaff = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const companyId = req.staff.companyId
    const data = req.body;

    const staff = await StaffRepo.create({
      staff: {...data, companyId},
      username: data.username,
      password: data.password,
    });

    return new SuccessResponse('Success', staff).send(res);
  },
);
