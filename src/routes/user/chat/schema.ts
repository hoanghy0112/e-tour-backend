import Joi from 'joi';

export default {
  createChat: Joi.object().keys({
    staffId: Joi.string().required(),
    userId: Joi.string().required(),
  }),
  createChatMessage: Joi.object().keys({
    chatRoomId: Joi.string().required(),
    content: Joi.string().required(),
  }),
  viewChatMessage: Joi.object().keys({
    chatRoomId: Joi.string().required(),
  }),
};
