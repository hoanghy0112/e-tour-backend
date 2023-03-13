import express from 'express';
import {
  ProtectedStaffRequest,
  ProtectedUserRequest,
} from '@/types/app-request';
import UserRepo from '@repository/User/UserRepo';
import {
  AuthFailureError,
  AccessTokenError,
  TokenExpiredError,
} from '../core/ApiError';
import JWT from '../core/JWT';
import KeystoreRepo from '@repository/KeystoreRepo';
import { Types } from 'mongoose';
import { getAccessToken, validateTokenData } from './authUtils';
import validator, { ValidationSource } from '@helpers/validator';
import schema from './schema';
import asyncHandler from '@helpers/asyncHandler';
import StaffRepo from '../database/repository/Company/StaffRepo/StaffRepo';

const userAuthentication = express.Router();
const staffAuthentication = express.Router();

userAuthentication.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: ProtectedUserRequest, res, next) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      const user = await UserRepo.findByCredentialId(
        new Types.ObjectId(payload.sub).toString(),
      );

      if (!user) throw new AuthFailureError('Invalid access token');
      req.user = user;

      const keystore = await KeystoreRepo.findforKey(payload.prm);
      if (!keystore) throw new AuthFailureError('Invalid access token');
      req.keystore = keystore;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }),
);

staffAuthentication.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: ProtectedStaffRequest, res, next) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      const staff = await StaffRepo.findByCredentialId(
        new Types.ObjectId(payload.sub).toString(),
      );
      if (!staff) throw new AuthFailureError('Staff not registered');
      req.staff = staff;

      const keystore = await KeystoreRepo.findforKey(payload.prm);
      if (!keystore) throw new AuthFailureError('Invalid access token');
      req.keystore = keystore;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }),
);

export default {
  userAuthentication,
  staffAuthentication,
};
