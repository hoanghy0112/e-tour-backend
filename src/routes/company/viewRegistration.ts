import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel from '../../database/model/Company/Company';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';

export const viewCompanyRegistration = asyncHandler(
  async (req: PublicRequest, res) => {
    const data = await CompanyModel.find({ isApproveToActive: false }, null, {
      sort: { updatedAt: -1 },
    });

    return new SuccessResponse('Success', data).send(res);
  },
);
