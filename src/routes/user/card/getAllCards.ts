import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import CardRepo from '../../../database/repository/User/CardRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../../types/app-request';

export const getAllCards = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user?._id;
    if (!userId) throw new BadRequestError('userId not found');

    const cardList = await CardRepo.findAll(userId);

    return new SuccessResponse('success', cardList).send(res);
  },
);
