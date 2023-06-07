import { Socket } from 'socket.io';
import { SuccessResponse } from '../../../core/ApiResponse';
import ChatRepo from '../../../database/repository/ChatRepo';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import socketValidator from '../../../helpers/socketValidator';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import schema from './schema';

export async function handleCreateChat(socket: Socket) {
  socket.on(
    SocketClientMessage.chat.CREATE_CHAT,
    socketAsyncHandler(
      socket,
      socketValidator(schema.createChat),
      async ({ routeId, userId }: { routeId: string; userId: string }) => {
        const chatRoom = await ChatRepo.createChat(routeId, userId);

        return new SuccessResponse('success', chatRoom).sendSocket(
          socket,
          SocketServerMessage.chat.CREATE_CHAT_RESULT,
        );
      },
    ),
  );
}
