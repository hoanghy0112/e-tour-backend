import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import { ICard } from '../../../database/model/User/User';
import CardRepo from '../../../database/repository/User/CardRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../../types/app-request';

export const updateCard = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user?._id;
    const cardId = req.params.cardId;
    const cardInfo = req.body as ICard;
    if (!userId) throw new BadRequestError('userId not found');

    const card = await CardRepo.modify(userId, cardId, cardInfo);
    if (!card) throw new BadRequestError('card not found');

    return new SuccessResponse('success', card).send(res);
  },
);
