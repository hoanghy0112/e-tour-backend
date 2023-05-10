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
  },
  savedTouristRoute: {
    saveRoute: Joi.object().keys({
      routeId: Joi.string().required(),
    }),
    removeRoute: Joi.object().keys({
      routeId: Joi.string().required(),
    }),
    viewSavedTouristRoute: Joi.object().keys({}),
  },
};
