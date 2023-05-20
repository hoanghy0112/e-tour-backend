import Joi from 'joi';

export default {
  followCompany: Joi.object().keys({
    companyId: Joi.string().required(),
  }),
};
