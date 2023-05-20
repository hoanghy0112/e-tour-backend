import Joi from 'joi';
import { NotificationType } from '../../../database/model/Company/Company';

export default {
  followCompany: Joi.object().keys({
    companyId: Joi.string().required(),
    notificationType: Joi.string()
      .allow(...Object.values(NotificationType))
      .optional()
      .default(NotificationType.ALL),
  }),
  unfollowCompany: Joi.object().keys({
    companyId: Joi.string().required(),
  }),
};
