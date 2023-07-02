import express from 'express';
import { Socket } from 'socket.io';
import authentication from '../../../auth/authentication';
import { handleCreateChat } from './createChat';
import { handleCreateChatMessage } from './createChatMessage';
import { handleGetChatRoomOfRoute } from './getChatRoomOfRoute';
import { handleViewChatMessage, handleViewChatRoomList } from './viewChat';
import { httpViewChatRoomList } from './viewChatHttp';

export const chatRouter = express.Router();

chatRouter.get('/', authentication.userAuthentication, httpViewChatRoomList);

export default function handleChat(socket: Socket) {
  handleCreateChat(socket);
  handleCreateChatMessage(socket);
  handleViewChatMessage(socket);
  handleViewChatRoomList(socket);
  handleGetChatRoomOfRoute(socket);
}
