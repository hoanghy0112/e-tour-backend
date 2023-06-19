import { ForbiddenError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel from '../../database/model/Company/Company';
import {
  StaffModel,
  StaffPermission,
} from '../../database/model/Company/Staff';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const viewStaffList = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const companyId = req.staff.companyId;

    const staffList = await StaffModel.find({ companyId });

    return new SuccessResponse('Success', staffList).send(res);
  },
);
