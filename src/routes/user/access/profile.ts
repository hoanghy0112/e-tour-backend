import express, { Request, Router } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import { SuccessResponse } from '../../../core/ApiResponse';
import authentication from '@auth/authentication';
import { Socket } from 'socket.io';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import WatchTable from '../../../helpers/realtime/WatchTable';
import UserModel, { User } from '../../../database/model/User/User';
import { BadRequestError } from '../../../core/ApiError';
import UserRepo from '../../../database/repository/User/UserRepo';

const profileRouter = express.Router();

profileRouter.get(
  '/',
  authentication.userAuthentication,
  asyncHandler(async (req: Request, res) => {
    //
    return new SuccessResponse('Success', {});
  }),
);

export async function handleViewUserProfile(socket: Socket) {
  socket.on(
    SocketClientMessage.VIEW_USER_PROFILE,
    socketAsyncHandler(socket, async () => {
      if (!socket.data.user) throw new BadRequestError('Not a user');

      const id = socket.data.user._id;

      WatchTable.register(UserModel)
        .filter((data: User) => data?._id?.toString() === id)
        .do((data) => {
          new SuccessResponse('update tour', data).sendSocket(
            socket,
            SocketServerMessage.USER_PROFILE,
          );
        });
      try {
        const user = await UserModel.findById(id);

        return new SuccessResponse(
          'Successfully retrieve user profile',
          user,
        ).sendSocket(socket, SocketServerMessage.USER_PROFILE);
      } catch (e) {
        throw new BadRequestError('User not found');
      }
    }),
  );
}

export default profileRouter;
