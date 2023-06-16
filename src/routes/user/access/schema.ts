import Joi from 'joi';
import { JoiAuthBearer } from '../../../helpers/validator';

export default {
  credential: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
  googleCredential: Joi.object().keys({
    accessToken: Joi.string().required(),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    fullName: Joi.string().required().min(3),
    identity: Joi.string().required(),
    isForeigner: Joi.boolean().required(),
    email: Joi.string().required().email(),
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(6),
    image: Joi.string().optional().uri(),
    address: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    identityExpiredAt: Joi.string().optional(),
    isPhoneVerified: Joi.string().optional(),
    isEmailVerified: Joi.string().optional(),
  }),
  googleSignup: Joi.object().keys({
    accessToken: Joi.string().required(),
    isForeigner: Joi.boolean().required(),
    fullName: Joi.string().required().min(3),
    identity: Joi.string().required(),
    email: Joi.string().required().email(),
    address: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    identityExpiredAt: Joi.string().optional(),
    isPhoneVerified: Joi.string().optional().default(false),
    isEmailVerified: Joi.string().optional().default(false),
  }),
  updateUserProfile: Joi.object().keys({
    fullName: Joi.string().min(3),
    identity: Joi.string(),
    isForeigner: Joi.boolean(),
    email: Joi.string().email(),
    image: Joi.string().optional(),
    address: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    identityExpiredAt: Joi.string().optional(),
  }),
};
