import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';

type AsyncFunction = (socket: Socket, next: NextFunction) => Promise<any>;

const socketAsyncHandler =
  (execution: AsyncFunction) => (socket: Socket, next: NextFunction) => {
    execution(socket, next).catch(next);
  };

export default socketAsyncHandler;
