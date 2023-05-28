import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import CardRepo from '../../../database/repository/User/CardRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../../types/app-request';

export const updateDefaultCard = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user?._id;
    const cardId = req.body.cardId;
    if (!userId) throw new BadRequestError('userId not found');

    const defaultCard = await CardRepo.changeDefaultCard(userId, cardId);

    return new SuccessResponse('success', defaultCard).send(res);
  },
);
