import authentication from '@auth/authentication';
import express, { Request } from 'express';
import { Socket } from 'socket.io';
import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import UserModel, { IUser } from '../../../database/model/User/User';
import asyncHandler from '../../../helpers/asyncHandler';
import WatchTable from '../../../helpers/realtime/WatchTable';
import socketAsyncHandler from '../../../helpers/socketAsyncHandler';
import {
  SocketClientMessage,
  SocketServerMessage,
} from '../../../types/socket';

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

      const listener = WatchTable.register(UserModel, socket)
        .filter((data: IUser) => data?._id?.toString() === id)
        .do((data, listenerId) => {
          new SuccessResponse('update tour', data, listenerId).sendSocket(
            socket,
            SocketServerMessage.USER_PROFILE,
          );
        });
      try {
        const user = await UserModel.findById(id);

        return new SuccessResponse(
          'Successfully retrieve user profile',
          user,
          listener.getId(),
        ).sendSocket(socket, SocketServerMessage.USER_PROFILE);
      } catch (e) {
        throw new BadRequestError('User not found');
      }
    }),
  );
}

export default profileRouter;
