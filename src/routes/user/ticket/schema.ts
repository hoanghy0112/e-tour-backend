import Joi from 'joi';
import { PaymentStatus } from '../../../database/model/User/Ticket';

export default {
  bookTicket: Joi.object().keys({
    ticketInfo: Joi.object().keys({
      // userId: Joi.string().required(),
      tourId: Joi.string().required(),
      fullName: Joi.string().required(),
      email: Joi.string().optional().allow('').default(''),
      phoneNumber: Joi.string().required(),
      status: Joi.string()
        .valid(...Object.values(PaymentStatus))
        .optional()
        .default(PaymentStatus.CHECKED_OUT),
      specialRequirement: Joi.string().optional().allow('').default(''),
      pickupLocation: Joi.string().optional().allow('').default(''),
      visitors: Joi.array()
        .optional()
        .items(
          Joi.object().keys({
            name: Joi.string().optional().allow('').default(''),
            age: Joi.number().optional().allow('').default(0),
            address: Joi.string().optional().allow('').default(''),
            phoneNumber: Joi.string().optional().allow('').default(''),
            request: Joi.string().optional().allow('').default(''),
          }),
        ),
    }),
    voucherIds: Joi.array().items(Joi.string()),
  }),
  updateTicket: Joi.object().keys({
    ticketId: Joi.string().required(),
    ticketInfo: Joi.object().keys({
      _id: Joi.string().optional(),
      fullName: Joi.string().optional(),
      email: Joi.string().optional().allow('').default(''),
      phoneNumber: Joi.string().optional(),
      status: Joi.string()
        .valid(...Object.values(PaymentStatus))
        .optional()
        .default(PaymentStatus.CHECKED_OUT),
      specialRequirement: Joi.string().optional().allow('').default(''),
      pickupLocation: Joi.string().optional().allow('').default(''),
      visitors: Joi.array()
        .optional()
        .items(
          Joi.object().keys({
            name: Joi.string().optional().allow('').default(''),
            age: Joi.number().optional().allow('').default(0),
            address: Joi.string().optional().allow('').default(''),
            phoneNumber: Joi.string().optional().allow('').default(''),
            request: Joi.string().optional().allow('').default(''),
          }),
        ),
    }),
  }),
  viewBookedTicket: Joi.object().keys({
    num: Joi.number().optional().default(5),
  }),
};
