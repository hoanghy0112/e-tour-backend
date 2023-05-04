import Joi from 'joi';
import { PaymentStatus } from '../../../database/model/User/Ticket';

export default {
  bookTicket: Joi.object().keys({
    ticketInfo: Joi.object().keys({
      // userId: Joi.string().required(),
      tourId: Joi.string().required(),
      fullName: Joi.string().optional().default(''),
      email: Joi.string().optional().default(''),
      phoneNumber: Joi.string().required(),
      status: Joi.string()
        .valid(...Object.values(PaymentStatus))
        .optional()
        .default(PaymentStatus.CHECKED_OUT),
      specialRequirement: Joi.string().optional().default(''),
      pickupLocation: Joi.string().optional().default(''),
      visitors: Joi.array()
        .optional()
        .items(
          Joi.object().keys({
            name: Joi.string().required(),
            age: Joi.number().required(),
            address: Joi.string().optional().default(''),
            phoneNumber: Joi.string().optional().default(''),
            request: Joi.string().optional().default(''),
          }),
        ),
    }),
    voucherIds: Joi.array().items(Joi.string()),
  }),
  viewTicketList: Joi.object().keys({
    num: Joi.number().optional().default(5),
  }),
};
