import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import TourRouteRepo from '../../database/repository/Company/TourRoute/TourRouteRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest } from '../../types/app-request';

export const deleteTouristRoute = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const { routeId } = req.params;

    const route = await TourRouteRepo.deleteRoute(routeId);

    return new SuccessResponse('Success', route).send(res);
  },
);
