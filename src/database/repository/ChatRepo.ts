import { BadRequestError } from '../../core/ApiError';
import { ChatModel } from '../model/Chat';
import CompanyModel, { ICompany } from '../model/Company/Company';
import { Staff, StaffModel } from '../model/Company/Staff';
import TouristsRouteModel, {
  ITouristsRoute,
} from '../model/Company/TouristsRoute';

async function createChat(routeId: string, userId: string) {
  let chatRoom;
  chatRoom = await ChatModel.findOne({ routeId, userId });
  console.log({ chatRoom });
  if (chatRoom) {
    return chatRoom;
    // throw new BadRequestError('tourist route exists');
  }
  const route = (
    await TouristsRouteModel.findById(routeId)
  )?.toObject() as ITouristsRoute;
  const staffList = (await StaffModel.find({
    companyId: route.companyId,
  })) as Staff[];
  // const staffId = staffList[Math.floor(Math.random() * staffList.length)]._id;
  const staffId = staffList[0]._id;
  chatRoom = (await ChatModel.create({ staffId, userId, routeId })).populate(
    'staffId',
  );
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
  const chatRooms = await ChatModel.find({
    $or: [
      {
        userId: uid,
      },
      {
        staffId: uid,
      },
    ],
  });
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
