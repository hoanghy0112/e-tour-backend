import Joi from 'joi';

export default {
  removeListener: Joi.object().keys({
    listenerId: Joi.string().required(),
  }),
};
