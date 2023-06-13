import { SuccessResponse } from '../../core/ApiResponse';
import TouristsRouteModel from '../../database/model/Company/TouristsRoute';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';

export const viewTouristRouteByFilter = asyncHandler(
  async (req: PublicRequest, res) => {
    const query = req.query;

    const data = await TouristsRouteModel.find(query);

    return new SuccessResponse('success', data).send(res);
  },
);
