import Joi from 'joi';

export default {
  createCard: Joi.object().keys({
    name: Joi.string().required(),
    cardNumber: Joi.string().required(),
    expiredDate: Joi.date().required(),
    cvv: Joi.string().required(),
  }),
  updateCard: Joi.object().keys({
    name: Joi.string().optional(),
    cardNumber: Joi.string().optional(),
    expiredDate: Joi.date().optional(),
    cvv: Joi.string().optional(),
  }),
  updateDefaultCard: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
};
