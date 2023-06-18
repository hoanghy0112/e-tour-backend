import { Socket } from 'socket.io';
import { environment } from '../config';
import {
  ApiError,
  BadRequestError,
  ErrorType,
  InternalError,
} from '../core/ApiError';
import Logger from '../core/Logger';
import { BadRequestResponse } from '../core/ApiResponse';
import { SocketServerMessage } from '../types/socket';

type MiddlewareFunction = (socket: Socket, data: any) => any;
type HandlerFunction = (data: any) => Promise<any>;

export const socketErrorHandler =
  (socket: Socket, eventName = SocketServerMessage.ERROR) =>
  (err: any) => {
    console.log({ eventName });
    if (err instanceof BadRequestError) {
      return new BadRequestResponse(err.message).sendSocket(
        socket,
        eventName || SocketServerMessage.ERROR,
      );
    }
    if (err instanceof ApiError) {
      ApiError.handleSocket(err, socket, eventName);
      if (err.type === ErrorType.INTERNAL)
        Logger.error(
          `500 - ${err.name} - ${err.type} - ${err.message} - ${err.stack}`,
        );
    } else {
      Logger.error(
        `500 - ${err.name} - ${err.type} - ${err.message} - ${err.stack}`,
      );
      Logger.error(err);
      if (environment === 'development') {
        socket.emit('error', err);
      }
      ApiError.handleSocket(new InternalError(), socket);
    }
  };

const socketAsyncHandler =
  (
    socket: Socket,
    serverEvent: string | MiddlewareFunction | HandlerFunction,
    ...func: (MiddlewareFunction | HandlerFunction | null)[]
  ) =>
  async (data: any) => {
    if (typeof serverEvent != 'string') func = [serverEvent, ...func];
    const middlewares = func.slice(0, func.length - 1);
    const execution = func.at(-1) as HandlerFunction;

    try {
      await Promise.all(
        middlewares.map(async (middleware) => await middleware?.(socket, data)),
      );
      await execution?.(data);
    } catch (error) {
      socketErrorHandler(
        socket,
        typeof serverEvent == 'string' ? serverEvent : '',
      )(error);
    }
  };

export default socketAsyncHandler;
