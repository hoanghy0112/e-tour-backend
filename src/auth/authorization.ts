import express from 'express';
import { ProtectedStaffRequest } from '@/types/app-request';
import { AuthFailureError } from '@core/ApiError';
import asyncHandler from '@helpers/asyncHandler';
import authentication from './authentication';
import { Permission } from '../database/model/Company/Staff';

// This middleware is only used to determine permissions of a staff
export default function authorization(permissions: Permission[]) {
  const router = express.Router();

  return router.use(
    authentication.staffAuthentication,
    asyncHandler(async (req: ProtectedStaffRequest, res, next) => {
      if (!req.staff || !req.staff.permissions)
        throw new AuthFailureError('Permission denied');

      const authorized = permissions.every((permission) =>
        req.staff.permissions.includes(permission),
      );

      if (!authorized) throw new AuthFailureError('Permission denied');

      return next();
    }),
  );
}
