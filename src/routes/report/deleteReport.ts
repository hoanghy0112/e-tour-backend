import { ForbiddenError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel from '../../database/model/Company/Company';
import { StaffPermission } from '../../database/model/Company/Staff';
import { ReportModel } from '../../database/model/Report';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const deleteReport = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const { id } = req.params;

    const data = await ReportModel.findByIdAndDelete(id);

    return new SuccessResponse('Success', data).send(res);
  },
);
