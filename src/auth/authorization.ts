import express from 'express';
import { ProtectedStaffRequest } from '@/types/app-request';
import { AuthFailureError } from '@core/ApiError';
import asyncHandler from '@helpers/asyncHandler';

const router = express.Router();

// This middleware is only used to determine permissions of a staff
export default router.use(
  asyncHandler(async (req: ProtectedStaffRequest, res, next) => {
    // if (!req.user || !req.currentRoleCodes)
    //   throw new AuthFailureError('Permission denied');

    // const authorized = false;

    // if (!authorized) throw new AuthFailureError('Permission denied');

    return next();
  }),
);
