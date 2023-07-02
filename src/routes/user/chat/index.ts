import { Socket } from 'socket.io';
import { handleCreateChat } from './createChat';
import { handleCreateChatMessage } from './createChatMessage';
import { handleGetChatRoomOfRoute } from './getChatRoomOfRoute';
import { handleViewChatMessage, handleViewChatRoomList } from './viewChat';


export default function handleChat(socket: Socket) {
  handleCreateChat(socket);
  handleCreateChatMessage(socket);
  handleViewChatMessage(socket);
  handleViewChatRoomList(socket);
  handleGetChatRoomOfRoute(socket);
}
