import { Socket } from 'socket.io';
import { handleCreateChat } from './createChat';
import { handleCreateChatMessage } from './createChatMessage';
import { handleViewChatMessage, handleViewChatRoomList } from './viewChat';
import { handleGetChatRoomOfRoute } from './getChatRoomOfRoute';

export default function handleChat(socket: Socket) {
  handleCreateChat(socket);
  handleCreateChatMessage(socket);
  handleViewChatMessage(socket);
  handleViewChatRoomList(socket);
  handleGetChatRoomOfRoute(socket);
}
