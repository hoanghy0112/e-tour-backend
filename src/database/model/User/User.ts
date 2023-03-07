import { Schema, model, Types } from 'mongoose';
import { Credential } from '../Credential';

export interface User {
  _id: Types.ObjectId;
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
}

const schema = new Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    // password: {
    //   type: String,
    //   required: true,
    // },
    image: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: false,
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
      ref: 'Credential'
    }
  },
  {
    timestamps: true,
  },
);

schema.index({ email: 1 });

const UserModel = model('User', schema);

export default UserModel;
