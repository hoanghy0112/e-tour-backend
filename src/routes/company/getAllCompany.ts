import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel from '../../database/model/Company/Company';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest, PublicRequest } from '../../types/app-request';

export const getAllCompany = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const data = await CompanyModel.find({}, '', {
      sort: { updatedAt: -1 },
    });

    return new SuccessResponse('Success', data).send(res);
  },
);
