import { SuccessResponse } from '../../core/ApiResponse';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import { uploadImageToS3 } from '../../database/s3';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const addStaff = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const companyId = req.staff.companyId;
    const data = req.body;

    let image;

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.image) {
        const imageFile = files?.image[0];
        image = imageFile ? await uploadImageToS3(imageFile) : '';
      }
    }

    data.image = image || undefined;

    const staff = await StaffRepo.create({
      staff: { ...data, companyId },
      username: data.username,
      password: data.password,
    });

    return new SuccessResponse('Success', staff).send(res);
  },
);
