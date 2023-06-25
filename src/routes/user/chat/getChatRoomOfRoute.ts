import { Socket } from 'socket.io';
import handleSocketAPI from '../../../helpers/handleSocketAPI';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import { SuccessResponse } from '../../../core/ApiResponse';
import schema from './schema';
import { ChatModel } from '../../../database/model/Chat';
import { BadRequestError } from '../../../core/ApiError';
import ChatRepo from '../../../database/repository/ChatRepo';

export function handleGetChatRoomOfRoute(socket: Socket) {
  handleSocketAPI({
    socket,
    clientEvent: SocketClientMessage.chat.GET_CHAT_ROOM_OF_ROUTE,
    serverEvent: SocketServerMessage.chat.GET_CHAT_ROOM_OF_ROUTE_RESULT,
    schema: schema.getChatRoomOfRoute,
    handler: async ({ routeId }: { routeId: string }) => {
      console.log({ routeId });
      const userId = socket.data?.user?._id;

      if (!userId) throw new BadRequestError('User not found');

      const chatRoom =
        (await ChatModel.findOne({ routeId, userId })) ||
        (await ChatRepo.createChat(routeId, userId));

      return new SuccessResponse('Success', chatRoom).sendSocket(
        socket,
        SocketServerMessage.chat.GET_CHAT_ROOM_OF_ROUTE_RESULT,
      );
    },
  });
}
