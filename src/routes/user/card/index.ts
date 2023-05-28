import express from 'express';
import createCardRouter from './createCard';

const cardRouter = express.Router();

cardRouter.use('/', createCardRouter);

export default cardRouter;
