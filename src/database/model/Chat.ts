import mongoose, { Schema, model, Types } from 'mongoose';
import watch from '../../helpers/realtime/watch';

export const CHAT_DOCUMENT_NAME = 'Chat';
export const CHAT_COLLECTION_NAME = 'chats';

export interface IChatItem {
  uid: Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IChat {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  staffId: Types.ObjectId;
  routeId: Types.ObjectId;
  chats: IChatItem[];
}

const schema = new Schema<IChat>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Staff',
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'TouristsRoute',
    },
    chats: [
      {
        uid: mongoose.Schema.Types.ObjectId,
        content: String,
        createdAt: Date,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ChatModel = model<IChat>(
  CHAT_DOCUMENT_NAME,
  schema,
  CHAT_COLLECTION_NAME,
);

ChatModel.watch().on('change', watch<IChat>(ChatModel));
