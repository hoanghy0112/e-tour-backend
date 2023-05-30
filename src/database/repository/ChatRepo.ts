import { ChatModel } from '../model/Chat';

async function createChat(staffId: string, userId: string) {
  const chatRoom = await ChatModel.create({ staffId, userId });
  return chatRoom;
}

async function createChatMessage(
  chatRoomId: string,
  uid: string,
  content: string,
  createdAt: Date,
) {
  const chatRoom = await ChatModel.findOneAndUpdate(
    {
      _id: chatRoomId,
      $or: [
        {
          userId: uid,
        },
        {
          staffId: uid,
        },
      ],
    },
    {
      $push: {
        chats: { uid, content, createdAt },
      },
    },
    { new: true },
  );
  return chatRoom;
}

async function viewChatRoomList(uid: string) {
  const chatRooms = await ChatModel.find(
    {
      $or: [
        {
          userId: uid,
        },
        {
          staffId: uid,
        },
      ],
    },
    '_id userId staffId',
  );
  return chatRooms;
}

async function viewChatMessageList(chatRoomId: string) {
  const chatRoom = await ChatModel.findById(chatRoomId);
  return chatRoom?.chats;
}

export default {
  createChat,
  createChatMessage,
  viewChatRoomList,
  viewChatMessageList,
};
