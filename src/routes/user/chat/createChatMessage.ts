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
import handleSocketAPI from '../../../helpers/handleSocketAPI';
import io from '../../../socketServer';

export async function handleCreateChatMessage(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.chat.CREATE_CHAT_MESSAGE,
    serverEvent: SocketServerMessage.chat.CREATE_CHAT_MESSAGE_RESULT,
    schema: schema.createChatMessage,
    handler: async ({
      chatRoomId,
      content,
    }: {
      chatRoomId: string;
      content: string;
    }) => {
      const uid = (socket.data.user || socket.data.staff)._id.toString();

      const now = new Date();
      const chatRoom = await ChatRepo.createChatMessage(
        chatRoomId,
        uid,
        content,
        now,
      );
      if (!chatRoom)
        throw new BadRequestError('user is not a member of chat room');

      io.in(`chat:${chatRoomId}`).emit(
        SocketServerMessage.chat.NEW_CHAT_MESSAGE,
        {
          uid,
          content,
          createdAt: now,
          chatRoomId,
        },
      );

      return new SuccessResponse('success', chatRoom).sendSocket(
        socket,
        SocketServerMessage.chat.CREATE_CHAT_MESSAGE_RESULT,
      );
    },
  });
}
