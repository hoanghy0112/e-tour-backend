import { Socket } from 'socket.io';
import express from 'express';
import { handleCreateTourRoute } from './createTouristRoute';
import { handleChangeTourRoute } from './updateTouristRoute';
import handleManageSavedTouristRoute, {
  addTouristRouteToSaved,
  removeTouristRouteFromSaved,
  viewSavedTouristRoute,
} from './saveTouristRoute';
import { handleViewTouristRoute } from './viewTouristRoute';
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

export const touristRouteRouter = express.Router();

touristRouteRouter.get(
  '/find',
  validator(schema.filter, ValidationSource.QUERY),
  viewTouristRouteByFilter,
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
  handleViewNotificationOfTour(socket);
}
