import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import CardRepo from '../../../database/repository/User/CardRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../../types/app-request';

export const getDetailCard = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user?._id;
    const cardId = req.params.cardId;
    if (!userId) throw new BadRequestError('userId not found');

    const card = await CardRepo.findById(userId, cardId);

    return new SuccessResponse('success', card).send(res);
  },
);
