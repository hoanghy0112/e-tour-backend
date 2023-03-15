import Joi from 'joi';
import { Socket } from 'socket.io';
import { BadRequestError, InternalError } from '../core/ApiError';
import Logger from '../core/Logger';

export type ISocketValidator = (socket: Socket, data: any) => void;

const socketValidator =
  (schema: Joi.AnySchema) =>
  (socket: Socket, data: any): void => {
    try {
      const { error } = schema.validate(data);

      if (!error) return;

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ''))
        .join(',');

      Logger.error(message);

      throw new BadRequestError(message);
    } catch (error) {
      throw new InternalError(JSON.stringify(error));
    }
  };

export default socketValidator;
