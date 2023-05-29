import express from 'express';
import validator from '../../helpers/validator';
import schema from './schema';
import { createReport } from './reportTour';

const reportRouter = express.Router();

reportRouter.post('/', validator(schema.createReport), createReport);

export default reportRouter;
