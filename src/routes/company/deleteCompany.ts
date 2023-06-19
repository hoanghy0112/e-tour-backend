import { ForbiddenError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel from '../../database/model/Company/Company';
import { StaffPermission } from '../../database/model/Company/Staff';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const deleteCompany = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const { companyId } = req.params;


    if (!req.staff.permissions.includes(StaffPermission.SUPER_ADMIN)) {
      if (req.staff.companyId.toString() != companyId)
        throw new ForbiddenError('Difference company');
    }

    const route = await CompanyModel.findByIdAndDelete(companyId);

    return new SuccessResponse('Success', route).send(res);
  },
);
