import { Socket } from 'socket.io';
import { BadRequestError } from '../core/ApiError';
import { SuccessResponse } from '../core/ApiResponse';
import socketAsyncHandler from '../helpers/socketAsyncHandler';
import Logger from '../core/Logger';
import { SocketClientEvent, SocketServerEvent } from '../types/socket';

export default function socketRouter(socket: Socket) {
  socket.on(
    SocketClientEvent.PING,
    socketAsyncHandler(socket, async (data: { text: string }) => {
      // For test
      if (data.text !== 'OK') throw new BadRequestError('Text data is not ok');
      return new SuccessResponse('connection is ok', {
        text: 'Yes',
      }).sendSocket(socket);
    }),
  );
}
