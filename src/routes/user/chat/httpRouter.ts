import express from 'express';
import authentication from '../../../auth/authentication';
import { httpViewChatRoomList } from './viewChatHttp';

export const chatRouter = express.Router();

chatRouter.get('/', authentication.userAuthentication, httpViewChatRoomList);
