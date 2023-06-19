import { SuccessResponse } from '../../core/ApiResponse';
import CompanyModel from '../../database/model/Company/Company';
import TouristsRouteModel from '../../database/model/Company/TouristsRoute';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest, PublicRequest } from '../../types/app-request';

export const getAllRoutes = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const data = await TouristsRouteModel.find({}, '', {
      sort: { updatedAt: -1 },
    });

    return new SuccessResponse('Success', data).send(res);
  },
);
