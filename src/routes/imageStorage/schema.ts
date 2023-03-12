import Joi from 'joi';

export default {
  getImage: Joi.object().keys({
    name: Joi.string().required(),
  }),
};
