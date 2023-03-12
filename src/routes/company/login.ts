import bcrypt from 'bcrypt';
import express from 'express';
import { AuthFailureError, BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import StaffRepo from '../../database/repository/Company/StaffRepo/StaffRepo';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import asyncHandler from '../../helpers/asyncHandler';
import validator from '../../helpers/validator';
import { PublicRequest } from '../../types/app-request';
import schema from './schema';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const staff = await StaffRepo.findByUsername({
      username: req.body.username,
    });
    if (!staff) throw new AuthFailureError('Authentication failure');

    if (!req.body.password) throw new BadRequestError('Credential not set');

    const match = await bcrypt.compare(
      req.body.password,
      staff.credential.password || '',
    );

    if (!match) throw new AuthFailureError('Authentication failure');

    const tokens = await KeystoreRepo.create(staff.credential);

    new SuccessResponse('Login Success', {
      staff,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
