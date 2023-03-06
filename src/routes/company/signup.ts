import { RoleRequest } from 'app-request';
import bcrypt from 'bcrypt';
import express from 'express';
import { BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import CompanyRepo from '../../database/repository/Company/CompanyRepo/CompanyRepo';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import asyncHandler from '../../helpers/asyncHandler';
import validator from '../../helpers/validator';
import schema from './schema';
import UserRepo from '../../database/repository/User/UserRepo';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const admin = await StaffRepo.findByUsername({
      username: req.body.username,
    });
    // if (admin) throw new BadRequestError('User already registered');

    // const passwordHash = await bcrypt.hash(req.body.password, 10);

    // const { createdAdmin, createdCompany } = await CompanyRepo.create({
    //   company: {
    //     isApproveToActive: false,
    //     name: req.body.name,
    //     email: req.body.email,
    //     description: req.body.description,
    //     image: req.body.image,
    //     previewImages: req.body.previewImages,
    //     address: req.body.address,
    //     phone: req.body.phone,
    //   },
    //   username: req.body.username,
    //   password: passwordHash,
    // });

    new SuccessResponse('Signup Successful', {
      // createdAdmin,
      // createdCompany,
    }).send(res);
  }),
);

export default router;
