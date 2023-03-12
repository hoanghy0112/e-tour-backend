import express, { Request, Router } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import { SuccessResponse } from '../../../core/ApiResponse';
import authentication from '@auth/authentication';

const profileRouter = express.Router();

profileRouter.get(
  '/',
  authentication.userAuthentication,
  asyncHandler(async (req: Request, res) => {
    //
    return new SuccessResponse('Success', {});
  }),
);

export default profileRouter;
