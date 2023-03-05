import { Schema, model, Types } from 'mongoose';

export interface UserInterface {
  fullName: string;
  email: string;
  password: string;
  image?: string;
  phone?: string;
  address?: string;
  identity: string;
  identityExpiredAt?: Date;
  tickets: Types.ObjectId;
  vouchers: Types.ObjectId;
  interests: Types.ObjectId;
  rates: Types.ObjectId;
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
    phone: {
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
    identityExpiredAt: {
      type: Date,
    },
    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
      },
    ],
    vouchers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Voucher',
      },
    ],
    interests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Interest',
      },
    ],
    rates: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Rate',
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 });

const User = model('User', userSchema);

export default User;
