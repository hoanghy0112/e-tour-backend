import express from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import { PublicRequest } from '../../../types/app-request';
import validator from '../../../helpers/validator';
import schema from './schema';
import { ICard } from '../../../database/model/User/User';
import CardRepo from '../../../database/repository/User/CardRepo';
import { SuccessResponse } from '../../../core/ApiResponse';

const createCardRouter = express.Router();

createCardRouter.post(
  '/',
  validator(schema.createCard),
  asyncHandler(async (req: PublicRequest, res) => {
    const cardInfo = req.body as ICard;

    // const newCard = await CardRepo.create(cardInfo);
    return new SuccessResponse('success', {}).send(res);
  }),
);

export default createCardRouter;
