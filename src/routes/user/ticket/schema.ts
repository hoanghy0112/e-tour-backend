import Joi from 'joi';
import { PaymentStatus } from '../../../database/model/User/Ticket';

export default {
  bookTicket: Joi.object().keys({
    ticketInfo: Joi.object().keys({
      userId: Joi.string().required(),
      tourId: Joi.string().required(),
      status: Joi.string().valid(...Object.values(PaymentStatus)),
      visitors: Joi.array()
        .optional()
        .items(
          Joi.object().keys({
            name: Joi.string().required(),
            age: Joi.number().required(),
            address: Joi.string().optional(),
            phoneNumber: Joi.number().optional(),
            request: Joi.string().optional(),
          }),
        ),
    }),
    voucherIds: Joi.array().items(Joi.string()),
  }),
};
