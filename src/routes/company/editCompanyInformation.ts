import authorization from '../../auth/authorization';
import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel from '../../database/model/Company/Company';
import { StaffPermission } from '../../database/model/Company/Staff';
import CompanyRepo from '../../database/repository/Company/CompanyRepo/CompanyRepo';
import { uploadImageToS3 } from '../../database/s3';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest, PublicRequest } from '../../types/app-request';

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
    const company = await CompanyModel.findByIdAndUpdate(companyId, data);

    return new SuccessResponse('Success', company).send(res);
  },
);
