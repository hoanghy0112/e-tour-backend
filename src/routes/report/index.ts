import express from 'express';
import validator from '../../helpers/validator';
import schema from './schema';
import { createReport } from './reportTour';
import { getApplicationReport, getCompanyReport, getRouteReport } from './getReport';
import authorization from '../../auth/authorization';
import { StaffPermission } from '../../database/model/Company/Staff';

const reportRouter = express.Router();

reportRouter.post('/', validator(schema.createReport), createReport);
reportRouter.get(
  '/application',
  authorization([StaffPermission.SUPER_ADMIN]),
  getApplicationReport,
);
reportRouter.get(
  '/company',
  authorization([StaffPermission.VIEW_REPORT]),
  getCompanyReport,
);
reportRouter.get(
  '/route/:routeId',
  authorization([StaffPermission.VIEW_REPORT]),
  getRouteReport,
);

export default reportRouter;
