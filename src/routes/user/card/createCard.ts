import express from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import {
  ProtectedUserRequest,
  PublicRequest,
} from '../../../types/app-request';
import validator from '../../../helpers/validator';
import schema from './schema';
import { ICard } from '../../../database/model/User/User';
import CardRepo from '../../../database/repository/User/CardRepo';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';

const createCardRouter = express.Router();

createCardRouter.post(
  '/',
  validator(schema.createCard),
  asyncHandler(async (req: ProtectedUserRequest, res) => {
    const userId = req.user._id;
    const cardInfo = req.body as ICard;

    if (!userId) throw new BadRequestError('userId not found');

    const newCard = await CardRepo.create(userId, cardInfo);

    if (!newCard) throw new BadRequestError('card is already exists');

    return new SuccessResponse('success', newCard).send(res);
  }),
);

export default createCardRouter;
