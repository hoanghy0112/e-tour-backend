import Joi from 'joi';

export default {
  createRate: Joi.object().keys({
    star: Joi.number().required(),
    description: Joi.string().optional().default(''),
    touristsRouteId: Joi.string().optional(),
    companyId: Joi.string().optional(),
  }),
  viewRateOfRoute: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
