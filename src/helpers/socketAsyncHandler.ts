import { Socket } from 'socket.io';
import { environment } from '../config';
import { ApiError, ErrorType, InternalError } from '../core/ApiError';
import Logger from '../core/Logger';

type MiddlewareFunction = (socket: Socket, data: any) => any;
type HandlerFunction = (data: any) => Promise<any>;

const errorHandler = (socket: Socket) => (err: any) => {
  if (err instanceof ApiError) {
    ApiError.handleSocket(err, socket);
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
  (socket: Socket, ...func: (MiddlewareFunction | HandlerFunction)[]) =>
  async (data: any) => {
    const middlewares = func.slice(0, func.length - 1);
    const execution = func.at(-1) as HandlerFunction;

    try {
      await Promise.all(
        middlewares.map(async (middleware) => await middleware?.(socket, data)),
      );
      await execution?.(data);
    } catch (error) {
      errorHandler(socket)(error);
    }
  };

export default socketAsyncHandler;
