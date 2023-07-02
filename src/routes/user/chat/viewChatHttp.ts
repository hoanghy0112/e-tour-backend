import { SuccessResponse } from '../../../core/ApiResponse';
import { ChatModel } from '../../../database/model/Chat';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../../types/app-request';

export const httpViewChatRoomList = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user._id;

    const data = await ChatModel.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: 'staffs',
          localField: 'staffId',
          foreignField: '_id',
          as: 'staff',
        },
      },
      {
        $lookup: {
          from: 'touristsroutes',
          localField: 'routeId',
          foreignField: '_id',
          as: 'route',
        },
      },
      {
        $unwind: {
          path: '$staff',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: '$route',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          routeId: 1,
          updatedAt: 1,
          staff: 1,
          route: 1,
          lastChat: {
            $arrayElemAt: ['$chats', 0],
          },
        },
      },
    ]).exec();

    return new SuccessResponse('Success', data).send(res);
  },
);
