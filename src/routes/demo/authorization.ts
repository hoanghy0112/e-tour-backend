import express from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';
import { SuccessResponse } from '../../core/ApiResponse';
import authorization from '../../auth/authorization';
import { Permission } from '../../database/model/Company/Staff';

const testAuthorizationRouter = express.Router();

testAuthorizationRouter.get(
  '/',
  authorization([Permission.EDIT_ROUTE, Permission.EDIT_TOUR]),
  asyncHandler(async (req: ProtectedStaffRequest, res) => {
    return new SuccessResponse('Success', {}).send(res);
  }),
);

export default testAuthorizationRouter;
