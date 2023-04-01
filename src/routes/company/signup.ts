import { RoleRequest } from '@/types/app-request';
import express, { Request } from 'express';
import { BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import CompanyRepo from '../../database/repository/Company/CompanyRepo/CompanyRepo';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import asyncHandler from '../../helpers/asyncHandler';
import validator from '../../helpers/validator';
import schema from './schema';
import multer from 'multer';
import { uploadImageToS3 } from '../../database/s3';
import Logger from '../../core/Logger';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/basic',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'previewImages' }]),
  validator(schema.signup),
  asyncHandler(async (req: Request, res) => {
    const admin = await StaffRepo.findByUsername({
      username: req.body.username,
    });

    if (admin) throw new BadRequestError('Username already registered');

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

    const { createdAdmin, createdCompany } = await CompanyRepo.create({
      company: {
        isApproveToActive: false,
        name: req.body.name,
        email: req.body.email,
        description: req.body.description,
        image: image || '',
        previewImages: previewImages,
        address: req.body.address,
        phone: req.body.phone,
      },
      username: req.body.username,
      password: req.body.password,
    });

    const tokens = await KeystoreRepo.create(createdAdmin.credential);

    new SuccessResponse('Signup Successful', {
      createdAdmin,
      createdCompany,
      tokens,
    }).send(res);
  }),
);

export default router;
