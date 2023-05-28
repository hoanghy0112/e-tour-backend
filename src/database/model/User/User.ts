import { Schema, model, Types } from 'mongoose';
import { Credential } from '../Credential';
import watch from '../../../helpers/realtime/watch';
import { ITouristsRoute } from '../Company/TouristsRoute';

export interface INotification {
  title: string;
  content: string;
  link: string;
  image: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ICard {
  cardNumber: string;
  expiredDate: Date;
  cvv: string;
  name: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  fullName: string;
  identity: string;
  isForeigner: boolean;
  email: string;
  image?: string;
  address?: string;
  phoneNumber?: string;
  identityExpiredAt?: Date;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  credential: Credential;
  savedRoutes?: ITouristsRoute[];
  notifications?: INotification[];
  cards: ICard[];
  defaultCard: string;
}

const schema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // unique: true,
      required: true,
    },
    image: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    identity: {
      type: String,
      required: true,
    },
    isForeigner: {
      type: Boolean,
      default: false,
    },
    identityExpiredAt: {
      type: Date,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    credential: {
      type: Schema.Types.ObjectId,
      ref: 'Credential',
    },
    savedRoutes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TouristsRoute',
      },
    ],
    notifications: [
      {
        title: String,
        content: String,
        link: String,
        image: String,
        isRead: {
          type: Boolean,
          default: false,
        },
        createdAt: Date,
      },
    ],
    cards: [
      {
        cardNumber: {
          type: String,
          unique: true,
        },
        name: String,
        expiredDate: Date,
        cvv: String,
      },
    ],
    defaultCard: Types.ObjectId,
  },
  {
    timestamps: true,
  },
);

schema.index({ email: 1 });

const UserModel = model('User', schema);

UserModel.watch().on('change', watch<IUser>(UserModel));

export default UserModel;
