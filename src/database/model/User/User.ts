import { Schema, model, Types } from 'mongoose';

export interface UserInterface {
  fullName: string;
  image?: string;
  address?: string;
  phoneNumber?: string;
  identity: string;
  isForeigner: boolean;
  email: string;
  identityExpiredAt?: Date;
  password: string;
}

const userSchema = new Schema<UserInterface>(
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
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 });

const User = model('User', userSchema);

export default User;
