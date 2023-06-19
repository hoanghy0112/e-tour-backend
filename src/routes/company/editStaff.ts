import { SuccessResponse } from '../../core/ApiResponse';
import { StaffModel } from '../../database/model/Company/Staff';
import { uploadImageToS3 } from '../../database/s3';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const editStaff = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const { id } = req.params;
    const companyId = req.staff.companyId;
    const staffData = req.body;

    let image;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.image) {
        const imageFile = files?.image[0];
        image = imageFile ? await uploadImageToS3(imageFile) : '';
      }
    }

    staffData.image = image || undefined;

    const staff = await StaffModel.findOneAndUpdate(
      { companyId, _id: id },
      staffData,
      { new: true },
    );

    return new SuccessResponse('Success', staff).send(res);
  },
);
