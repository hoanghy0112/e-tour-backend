import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel, {
  ProfileState,
} from '../../database/model/Company/Company';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';

export const approveCompanyRegistration = asyncHandler(
  async (req: PublicRequest, res) => {
    const { companyId, isApproveToActive } = req.body;
    const data = await CompanyModel.findByIdAndUpdate(
      { companyId },
      {
        profileState: isApproveToActive
          ? ProfileState.APPROVED
          : ProfileState.REJECTED,
        isApproveToActive: isApproveToActive,
      },
      { new: true },
    );

    return new SuccessResponse('Success', data).send(res);
  },
);
