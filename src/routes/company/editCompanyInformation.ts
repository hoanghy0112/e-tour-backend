import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel, {
  ProfileState,
} from '../../database/model/Company/Company';
import { uploadImageToS3 } from '../../database/s3';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const editCompanyInformation = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const { companyId } = req.params;
    const data = req.body;

    let image;
    let previewImages;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.image) {
        const imageFile = files?.image[0];
        image = imageFile ? await uploadImageToS3(imageFile) : '';
      }

      if (files?.previewImages) {
        const previewImageFiles = files?.previewImages as Express.Multer.File[];
        previewImages = await Promise.all(
          previewImageFiles.map(async (image) =>
            image ? (await uploadImageToS3(image)) || '' : '',
          ),
        );
      }
    }

    data.image = image || undefined;
    data.previewImages = previewImages || undefined;
    const c = await CompanyModel.findById(companyId);
    if (!c?.isApproveToActive) data.profileState = ProfileState.PENDING;
    const company = await CompanyModel.findByIdAndUpdate(companyId, data);

    return new SuccessResponse('Success', company).send(res);
  },
);
