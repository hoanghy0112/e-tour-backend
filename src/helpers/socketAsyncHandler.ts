import { Socket } from 'socket.io';
import Logger from '../core/Logger';
import { ApiError, ErrorType, InternalError } from '../core/ApiError';
import { environment } from '../config';

type AsyncFunction = (...data: any) => Promise<any>;

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
  (socket: Socket, execution: AsyncFunction) =>
  (...data: any) => {
    execution(...data).catch(errorHandler(socket));
  };

export default socketAsyncHandler;
