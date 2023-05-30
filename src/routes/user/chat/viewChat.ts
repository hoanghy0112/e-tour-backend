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
import { BadRequestError } from '../../../core/ApiError';

export async function handleViewChatRoomList(socket: Socket) {
  socket.on(
    SocketClientMessage.chat.VIEW_CHAT_ROOM_LIST,
    socketAsyncHandler(socket, async () => {
      const uid = (socket.data.user || socket.data.staff)._id.toString();
      if (!uid) throw new BadRequestError('User not found');

      const chatRooms = await ChatRepo.viewChatRoomList(uid);

      return new SuccessResponse('success', chatRooms).sendSocket(
        socket,
        SocketServerMessage.chat.CHAT_ROOM_LIST,
      );
    }),
  );
}

export async function handleViewChatMessage(socket: Socket) {
  socket.on(
    SocketClientMessage.chat.VIEW_CHAT_MESSAGE,
    socketAsyncHandler(
      socket,
      socketValidator(schema.viewChatMessage),
      async ({ chatRoomId }: { chatRoomId: string }) => {
        const chatMessages = await ChatRepo.viewChatMessageList(chatRoomId);
        socket.join(`chat:${chatRoomId}`);

        return new SuccessResponse('success', chatMessages).sendSocket(
          socket,
          SocketServerMessage.chat.CHAT_MESSAGE_LIST,
        );
      },
    ),
  );
}
