import express from 'express';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

const testAuthorizationRouter = express.Router();

testAuthorizationRouter.get(
  '/authorization',
  asyncHandler(async (req: ProtectedStaffRequest, res) => {
    //
  }),
);

export default testAuthorizationRouter;
