import Joi from 'joi';
import { NotificationType } from '../../database/model/Company/Company';
import { TouristsRouteType } from '../../database/model/Company/TouristsRoute';

export default {
  viewTouristRoute: {
    byFilter: Joi.object().keys({
      route: Joi.array().items(Joi.string()).optional(),
      keyword: Joi.string().min(0).optional(),
    }),
    byId: Joi.object().keys({
      id: Joi.string(),
    }),
    byPopularity: Joi.object().keys({
      num: Joi.number().optional().default(5),
      skip: Joi.number().optional().default(0),
    }),
    ofCompany: Joi.object().keys({
      companyId: Joi.string().required(),
    }),
  },
  increasePoint: Joi.object().keys({
    routeId: Joi.string().required(),
    point: Joi.number().required(),
  }),
  savedTouristRoute: {
    saveRoute: Joi.object().keys({
      routeId: Joi.string().required(),
    }),
    removeRoute: Joi.object().keys({
      routeId: Joi.string().required(),
    }),
    viewSavedTouristRoute: Joi.object().keys({}),
  },
  followTouristRoute: Joi.object().keys({
    routeId: Joi.string().required(),
    notificationType: Joi.string()
      .allow(...Object.values(NotificationType))
      .optional()
      .default(NotificationType.ALL),
  }),
  unfollowTouristRoute: Joi.object().keys({
    routeId: Joi.string().required(),
  }),
  createTourRoute: Joi.object().keys({
    reservationFee: Joi.number().optional().default(0),
    name: Joi.string().required().min(10),
    description: Joi.string().required().min(10),
    type: Joi.string()
      .valid(...Object.values(TouristsRouteType))
      .default(TouristsRouteType.COUNTRY),
    route: Joi.array().items(Joi.string()),
    images: Joi.array().items(Joi.any()).default([]),
  }),
  editTourRoute: Joi.object().keys({
    _id: Joi.string().required(),
    reservationFee: Joi.number().optional().default(0),
    name: Joi.string().optional().min(1),
    description: Joi.string().optional().min(1),
    type: Joi.string()
      .valid(...Object.values(TouristsRouteType))
      .default(TouristsRouteType.COUNTRY),
    route: Joi.array().items(Joi.string()),
    images: Joi.any(),
  }),
  filter: Joi.object().keys({
    companyId: Joi.string(),
  }),
  savedList: Joi.object().keys({
    routeId: Joi.string(),
  }),
};
