import Joi from 'joi';

export default {
  viewTour: {
    byFilter: Joi.object().keys({
      touristRoute: Joi.string(),
      from: Joi.date(),
      to: Joi.date(),
    }),
    byId: Joi.object().keys({
      id: Joi.string(),
    }),
  },
  deleteTour: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
