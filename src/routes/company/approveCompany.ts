import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel, {
  ICompany,
  ProfileState,
} from '../../database/model/Company/Company';
import sendEmail from '../../database/repository/Mail/MailRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';

export const approveCompanyRegistration = asyncHandler(
  async (req: PublicRequest, res) => {
    const { companyId } = req.params;
    const { isApproveToActive, note } = req.body;
    const oldData = (await CompanyModel.findById(companyId)) as ICompany;
    const data = (await CompanyModel.findByIdAndUpdate(
      companyId,
      {
        profileState: isApproveToActive
          ? ProfileState.APPROVED
          : ProfileState.REJECTED,
        isApproveToActive: isApproveToActive,
      },
      { new: true },
    )) as ICompany;

    if (isApproveToActive) {
      sendEmail({
        to: data.email,
        subject: 'E-Tour company registration result',
        subTitle: '',
        header: 'Your company profile has been accepted',
        content: 'Now you can run your own travel business with E-Tour',
      });
    } else {
      if (oldData.profileState == ProfileState.APPROVED) {
        sendEmail({
          to: data.email,
          subject: 'E-Tour Business ban',
          subTitle: '',
          header: 'Your company has been banned by E-Tour admin',
          content: 'Your can send email to us in 24h to remove ban',
        });
      } else {
      }
    }

    return new SuccessResponse('Success', data).send(res);
  },
);
