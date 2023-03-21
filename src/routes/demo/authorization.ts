import express from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';
import { SuccessResponse } from '../../core/ApiResponse';
import authorization from '../../auth/authorization';
import { StaffPermission } from '../../database/model/Company/Staff';

const testAuthorizationRouter = express.Router();

testAuthorizationRouter.get(
  '/',
  authorization([StaffPermission.EDIT_ROUTE, StaffPermission.EDIT_TOUR]),
  asyncHandler(async (req: ProtectedStaffRequest, res) => {
    return new SuccessResponse('Success', {}).send(res);
  }),
);

export default testAuthorizationRouter;
