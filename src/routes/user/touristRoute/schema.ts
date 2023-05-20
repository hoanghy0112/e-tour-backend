import Joi from 'joi';

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
  }),
};
