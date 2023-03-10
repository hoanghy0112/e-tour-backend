import { RoleRequest } from '@/types/app-request';
import bcrypt from 'bcrypt';
import express from 'express';
import { BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import CompanyRepo from '../../database/repository/Company/CompanyRepo/CompanyRepo';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import asyncHandler from '../../helpers/asyncHandler';
import validator from '../../helpers/validator';
import schema from './schema';
import {
  AuthenticationType,
  Credential,
  UserType,
} from '../../database/model/Credential';
import CredentialRepo from '../../database/repository/CredentialRepo';
import KeystoreRepo from '../../database/repository/KeystoreRepo';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const admin = await StaffRepo.findByUsername({
      username: req.body.username,
    });
    if (admin) throw new BadRequestError('User already registered');

    const { createdAdmin, createdCompany } = await CompanyRepo.create({
      company: {
        isApproveToActive: false,
        name: req.body.name,
        email: req.body.email,
        description: req.body.description,
        image: req.body.image,
        previewImages: req.body.previewImages,
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
