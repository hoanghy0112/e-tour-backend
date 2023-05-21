import Joi from 'joi';
import { NotificationType } from '../../../database/model/Company/Company';

export default {
  viewNewNotification: Joi.object().keys({}),
  readNotification: Joi.object().keys({
    notificationIDs: Joi.array().items(Joi.string()),
  }),
};
