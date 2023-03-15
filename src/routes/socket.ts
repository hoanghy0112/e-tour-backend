import { Socket } from 'socket.io';
import { BadRequestError } from '../core/ApiError';
import { SuccessResponse } from '../core/ApiResponse';
import socketAsyncHandler from '../helpers/socketAsyncHandler';
import Logger from '../core/Logger';
import { SocketClientMessage, SocketServerMessage } from '../types/socket';

export default function socketRouter(socket: Socket) {
  socket.on(
    SocketClientMessage.PING,
    socketAsyncHandler(socket, async (data: { text: string }) => {
      // For test
      console.log({ socket });
      if (data.text !== 'OK') throw new BadRequestError('Text data is not ok');
      return new SuccessResponse('connection is ok', {
        text: 'Yes',
        data: socket.data,
      }).sendSocket(socket);
    }),
  );
}
