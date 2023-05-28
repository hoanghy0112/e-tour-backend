import Joi from 'joi';

export default {
  createCard: Joi.object().keys({
    name: Joi.string().required(),
    cardNumber: Joi.string().required(),
    expiredAt: Joi.date().required(),
    cvv: Joi.string().required(),
  }),
};
