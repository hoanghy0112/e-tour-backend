import Joi from 'joi';
import { VoucherType } from '../../database/model/User/Voucher';

export default {
  credential: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
  signup: Joi.object().keys({
    name: Joi.string().required().min(1),
    email: Joi.string().required().email(),
    description: Joi.string().optional().min(1),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(6),
  }),
  updateCompanyInfo: Joi.object().keys({
    name: Joi.string().min(1),
    email: Joi.string().email(),
    description: Joi.string().optional().min(1),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
  }),
  addStaff: Joi.object().keys({
    fullName: Joi.string().required().min(1),
    role: Joi.string().required(),
    permissions: Joi.array().items(Joi.string()),
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(6),
  }),
  voucher: {
    createVoucher: Joi.object().keys({
      companyId: Joi.string().required(),
      name: Joi.string().required(),
      expiredAt: Joi.date().required(),
      type: Joi.string()
        .allow(...Object.values(VoucherType))
        .optional()
        .default(VoucherType.NORMAL),
      description: Joi.string().optional().allow(''),
      image: Joi.any().optional(),
      usingCondition: Joi.string().optional().allow(''),
      value: Joi.number().optional().default(0),
      num: Joi.number().optional().default(10),
    }),
  },
};
