import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { RoleRequest } from '@/types/app-request';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/User/UserRepo';
import { BadRequestError } from '../../../core/ApiError';
import { IUser } from '../../../database/model/User/User';
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
import multer from 'multer';
import { uploadImageToS3 } from '../../../database/s3';
import { getAuth } from 'firebase-admin/auth';
import firebaseApp from '../../../services/firebase';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/basic',
  upload.single('image'),
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    const image = req.file;

    const user = await UserRepo.findByUsername(req.body.username);

    if (user) throw new BadRequestError('User already registered');
    if (req.body.isForeigner === 'true' && !req.body.identityExpiredAt)
      throw new BadRequestError('identityExpiredAt is empty');
    if (
      req.body.isForeigner === 'false' &&
      !req.body.address &&
      !req.body.phoneNumber
    )
      throw new BadRequestError('address or phoneNumber is empty');

    const credential = {
      authenticationType: AuthenticationType.PASSWORD,
      userType: UserType.CLIENT,
      username: req.body.username,
      password: req.body.password,
    } as Credential;
    const createdCredential = await CredentialRepo.create(credential);

    const tokens = await KeystoreRepo.create(createdCredential);

    const imageID = image ? await uploadImageToS3(image) : '';

    const createdUser = await UserRepo.create({
      fullName: req.body.fullName,
      identity: req.body.identity,
      isForeigner: req.body.isForeigner === 'true',
      email: req.body.email,
      address: req.body.address,
      image: imageID,
      phoneNumber: req.body.phoneNumber,
      identityExpiredAt: req.body.identityExpiredAt,
      isPhoneVerified: req.body.isPhoneVerified,
      isEmailVerified: req.body.isEmailVerified,
      credential: createdCredential,
    } as IUser);

    new SuccessResponse('Signup Successful', {
      user: createdUser,
      tokens: tokens,
    }).send(res);
  }),
);

router.post(
  '/google',
  upload.single('image'),
  validator(schema.googleSignup),
  asyncHandler(async (req: RoleRequest, res) => {
    const accessToken = req.body.accessToken;

    const decodedIdToken = await getAuth(firebaseApp).verifyIdToken(
      accessToken,
    );

    const uid = decodedIdToken.uid;

    const user = await UserRepo.findByUID(uid);
    const userProfile = await getAuth(firebaseApp).getUser(uid);

    if (user) throw new BadRequestError('User already registered');

    if (req.body.isForeigner === 'true' && !req.body.identityExpiredAt)
      throw new BadRequestError('identityExpiredAt is empty');
    if (
      req.body.isForeigner === 'false' &&
      !req.body.address &&
      !req.body.phoneNumber
    )
      throw new BadRequestError('address or phoneNumber is empty');

    const credential = {
      authenticationType: AuthenticationType.GOOGLE,
      userType: UserType.CLIENT,
      uid,
    } as Credential;
    const createdCredential = await CredentialRepo.create(credential);

    const tokens = await KeystoreRepo.create(createdCredential);

    const createdUser = await UserRepo.create({
      fullName: req.body.fullName || userProfile.displayName,
      identity: req.body.identity,
      isForeigner: req.body.isForeigner === 'true',
      email: req.body.email || userProfile.email,
      address: req.body.address,
      image: userProfile.photoURL,
      phoneNumber: req.body.phoneNumber || userProfile.phoneNumber,
      identityExpiredAt: req.body.identityExpiredAt,
      isPhoneVerified: req.body.isPhoneVerified,
      isEmailVerified: req.body.isEmailVerified || userProfile.emailVerified,
      credential: createdCredential,
    } as IUser);

    new SuccessResponse('Signup successful', {
      user: createdUser,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
