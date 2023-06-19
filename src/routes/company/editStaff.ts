import { SuccessResponse } from '../../core/ApiResponse';
import { StaffModel } from '../../database/model/Company/Staff';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const editStaff = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const { id } = req.params;
    const companyId = req.staff.companyId;
    const staffData = req.body;

    const staff = await StaffModel.findOneAndUpdate(
      { companyId, _id: id },
      staffData,
      { new: true },
    );

    return new SuccessResponse('Success', staff).send(res);
  },
);
