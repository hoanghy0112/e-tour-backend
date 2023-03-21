import express from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import {
  ProtectedStaffRequest,
  ProtectedUserRequest,
} from '../../types/app-request';
import { SuccessResponse } from '../../core/ApiResponse';
import authentication from '../../auth/authentication';
import WatchTable from '../../helpers/realtime/WatchTable';

const testAuthenticationRouter = express.Router();

testAuthenticationRouter.get(
  '/user',
  authentication.userAuthentication,
  asyncHandler(async (req: ProtectedUserRequest, res) => {
    return new SuccessResponse('Success', {
      user: req.user,
      accessToken: req.accessToken,
    }).send(res);
  }),
);

testAuthenticationRouter.get(
  '/staff',
  authentication.staffAuthentication,
  asyncHandler(async (req: ProtectedStaffRequest, res) => {
    return new SuccessResponse('Success', {
      staff: req.staff,
      accessToken: req.accessToken,
    }).send(res);
  }),
);

export default testAuthenticationRouter;
