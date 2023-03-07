import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/User/UserRepo';
import { BadRequestError } from '../../../core/ApiError';
import { User } from '../../../database/model/User/User';
import { createTokens } from '../../../auth/authUtils';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import { getUserData } from './utils';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import {
  AuthenticationType,
  Credential,
  UserType,
} from '../../../database/model/Credential';
import CredentialRepo from '../../../database/repository/CredentialRepo';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByUsername(req.body.username);
    if (user) throw new BadRequestError('User already registered');

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const credential = {
      authenticationType: AuthenticationType.PASSWORD,
      userType: UserType.CLIENT,
      username: req.body.username,
      password: passwordHash,
    } as Credential;
    const createdCredential = await CredentialRepo.create(credential);

    const tokens = await KeystoreRepo.create(createdCredential);

    const createdUser = await UserRepo.create({
      fullName: req.body.fullName,
      identity: req.body.identity,
      isForeigner: req.body.isForeigner,
      email: req.body.email,
      image: req.body.image,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      identityExpiredAt: req.body.identityExpiredAt,
      isPhoneVerified: req.body.isPhoneVerified,
      isEmailVerified: req.body.isEmailVerified,
      credential: createdCredential,
    } as User);

    const userData = await getUserData(createdUser);

    new SuccessResponse('Signup Successful', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
