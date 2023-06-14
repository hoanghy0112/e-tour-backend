import bcrypt from 'bcrypt';
import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { AuthFailureError, BadRequestError } from '../../../core/ApiError';
import { BadRequestResponse, SuccessResponse } from '../../../core/ApiResponse';
import KeystoreRepo from '../../../database/repository/KeystoreRepo';
import UserRepo from '../../../database/repository/User/UserRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import validator from '../../../helpers/validator';
import firebaseApp from '../../../services/firebase';
import { PublicRequest } from '../../../types/app-request';
import schema from './schema';

const router = express.Router();

router.post(
  '/basic',
  validator(schema.credential),
  asyncHandler(async (req: PublicRequest, res) => {
    const user = await UserRepo.findByUsername(req.body.username);
    if (!user) throw new AuthFailureError('Authentication failure');

    if (!user.credential.password)
      throw new BadRequestError('Credential not set');

    const match = await bcrypt.compare(
      req.body.password,
      user.credential.password,
    );
    if (!match) throw new AuthFailureError('Authentication failure');

    const tokens = await KeystoreRepo.create(user.credential);

    new SuccessResponse('Login Success', {
      user: user,
      tokens: tokens,
    }).send(res);
  }),
);

router.post(
  '/google',
  validator(schema.googleCredential),
  asyncHandler(async (req: PublicRequest, res) => {
    const accessToken = req.body.accessToken;

    const decodedIdToken = await getAuth(firebaseApp).verifyIdToken(
      accessToken,
    );

    const uid = decodedIdToken.uid;

    if (!uid) throw new BadRequestError('accessToken is wrong');

    const user = await UserRepo.findByUID(uid);
    const userProfile = await getAuth(firebaseApp).getUser(uid);

    if (user) {
      const tokens = await KeystoreRepo.create(user.credential);

      return new SuccessResponse('Login Success', {
        user: user,
        tokens: tokens,
      }).send(res);
    } else {
      return new BadRequestResponse('User not found').send(res);
    }
  }),
);

export default router;
