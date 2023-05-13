import Joi from 'joi';

export default {
  viewVoucher: {
    byId: Joi.object().keys({
      id: Joi.string().required(),
    }),
    newVoucher: Joi.object().keys({}),
  },
};
