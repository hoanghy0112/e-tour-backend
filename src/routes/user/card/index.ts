import express from 'express';
import validator from '../../../helpers/validator';
import schema from './schema';
import { createNewCard } from './createCard';
import { getAllCards } from './getAllCards';
import { getDetailCard } from './getDetailCard';
import { updateCard } from './updateCard';
import { getDefaultCard } from './getDefaultCard';
import { updateDefaultCard } from './updateDefaultCard';
import { deleteCard } from './deleteCard';

const cardRouter = express.Router();

cardRouter.post('/', validator(schema.createCard), createNewCard);
cardRouter.get('/', getAllCards);

cardRouter.get('/default', getDefaultCard);
cardRouter.put(
  '/default',
  validator(schema.updateDefaultCard),
  updateDefaultCard,
);

cardRouter.get('/:cardId', getDetailCard);
cardRouter.put('/:cardId', validator(schema.updateCard), updateCard);
cardRouter.delete('/:cardId', deleteCard);

export default cardRouter;
