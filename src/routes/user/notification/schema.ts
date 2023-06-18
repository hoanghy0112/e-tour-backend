import Joi from 'joi';
import { NotificationType } from '../../../database/model/Company/Company';

export default {
  viewNewNotification: Joi.object().keys({}),
  viewTourNotification: Joi.object().keys({
    tourId: Joi.string().required()
  }),
  readNotification: Joi.object().keys({
    notificationIDs: Joi.array().items(Joi.string()),
  }),
  pushNotificationToTourCustomer: Joi.object().keys({
    tourId: Joi.string().required(),
    type: Joi.string().allow(...Object.values(NotificationType)),
    notification: Joi.object().keys({
      title: Joi.string().required(),
      content: Joi.string(),
      link: Joi.string(),
      image: Joi.string(),
    }),
  }),
};
