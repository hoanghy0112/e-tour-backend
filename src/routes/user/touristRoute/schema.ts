import Joi from 'joi';

export default {
  viewTour: {
    byFilter: Joi.object().keys({
      route: Joi.array().items(Joi.string()),
      keyword: Joi.string().optional(),
    }),
    byId: Joi.object().keys({
      id: Joi.string(),
    }),
  },
};
