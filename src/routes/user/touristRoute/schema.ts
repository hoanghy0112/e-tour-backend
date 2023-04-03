import Joi from 'joi';

export default {
  viewTour: {
    byFilter: Joi.object().keys({
      route: Joi.array().items(Joi.string()).optional(),
      keyword: Joi.string().min(0).optional(),
    }),
    byId: Joi.object().keys({
      id: Joi.string(),
    }),
  },
};
