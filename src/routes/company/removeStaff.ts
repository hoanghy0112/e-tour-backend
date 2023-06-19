import { SuccessResponse } from '../../core/ApiResponse';
import { StaffModel } from '../../database/model/Company/Staff';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const removeStaff = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const { id } = req.params;
    const companyId = req.staff.companyId;

    const staff = await StaffModel.findOneAndDelete({ companyId, _id: id });

    return new SuccessResponse('Success', staff).send(res);
  },
);
