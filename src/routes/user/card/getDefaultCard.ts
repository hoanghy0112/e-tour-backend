import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import CardRepo from '../../../database/repository/User/CardRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../../types/app-request';

export const getDefaultCard = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user?._id;
    if (!userId) throw new BadRequestError('userId not found');

    const defaultCard = await CardRepo.findDefaultCard(userId);

    return new SuccessResponse('success', defaultCard).send(res);
  },
);
