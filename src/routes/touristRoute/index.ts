import { Socket } from 'socket.io';
import express from 'express';
import { handleCreateTourRoute } from './createTouristRoute';
import { handleChangeTourRoute } from './updateTouristRoute';
import handleManageSavedTouristRoute from './saveTouristRoute';
import { handleViewTouristRoute } from './viewTouristRoute';
import {
  handleFollowTouristRoute,
  handleUnFollowTouristRoute,
} from './followTouristRoute';
import { viewTouristRouteByFilter } from './viewTouristRouteByFilter';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';

export const touristRouteRouter = express.Router();

touristRouteRouter.get(
  '/find',
  validator(schema.filter, ValidationSource.QUERY),
  viewTouristRouteByFilter,
);

export function handleTouristRoute(socket: Socket) {
  handleCreateTourRoute(socket);
  handleChangeTourRoute(socket);
  handleManageSavedTouristRoute(socket);
  handleViewTouristRoute(socket);
  handleFollowTouristRoute(socket);
  handleUnFollowTouristRoute(socket);
}
