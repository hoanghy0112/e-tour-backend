import { Socket } from 'socket.io';
import express from 'express';
import { handleCreateTourRoute } from './createTouristRoute';
import { handleChangeTourRoute } from './updateTouristRoute';
import handleManageSavedTouristRoute, {
  addTouristRouteToSaved,
  removeTouristRouteFromSaved,
  viewSavedTouristRoute,
} from './saveTouristRoute';
import {
  handleSearchTouristRoute,
  handleViewTouristRoute,
  handleViewTouristRouteOfCompany,
} from './viewTouristRoute';
import {
  handleFollowTouristRoute,
  handleUnFollowTouristRoute,
} from './followTouristRoute';
import { viewTouristRouteByFilter } from './viewTouristRouteByFilter';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import authentication from '../../auth/authentication';
import { deleteTouristRoute } from './deleteTouristRoute';
import { handleViewNotificationOfTour } from '../user/notification/notification';
import authorization from '../../auth/authorization';
import { StaffPermission } from '../../database/model/Company/Staff';
import { getAllRoutes } from './getAllRoutes';
import {
  getRecommendRouteByFilter,
  getRecommendRouteByRouteId,
} from './getRecommendRoute';

export const touristRouteRouter = express.Router();

touristRouteRouter.get('/find', viewTouristRouteByFilter);

touristRouteRouter.get('/recommend', getRecommendRouteByFilter);
touristRouteRouter.get('/recommend/similar', getRecommendRouteByRouteId);

touristRouteRouter.get(
  '/',
  authorization([StaffPermission.SUPER_ADMIN]),
  getAllRoutes,
);

touristRouteRouter.post(
  '/saved/:routeId',
  authentication.userAuthentication,
  validator(schema.savedList, ValidationSource.PARAM),
  addTouristRouteToSaved,
);
touristRouteRouter.delete(
  '/saved/:routeId',
  authentication.userAuthentication,
  validator(schema.savedList, ValidationSource.PARAM),
  removeTouristRouteFromSaved,
);
touristRouteRouter.get(
  '/saved',
  authentication.userAuthentication,
  viewSavedTouristRoute,
);
touristRouteRouter.delete(
  '/:routeId',
  authentication.staffAuthentication,
  deleteTouristRoute,
);

export function handleTouristRoute(socket: Socket) {
  handleCreateTourRoute(socket);
  handleChangeTourRoute(socket);
  handleManageSavedTouristRoute(socket);
  handleViewTouristRoute(socket);
  handleFollowTouristRoute(socket);
  handleUnFollowTouristRoute(socket);
  handleViewTouristRouteOfCompany(socket);
  handleSearchTouristRoute(socket);
}
