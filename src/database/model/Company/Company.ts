import { Schema, Types, model } from 'mongoose';
import { IUser } from '../User/User';

export enum NotificationType {
  ALL = 'all',
  ONLY_SPECIAL = 'only-special',
  NONE = 'none',
}

export interface IFollower {
  user: IUser;
  notificationType: NotificationType;
}

export interface ICompany {
  _id?: Types.ObjectId;
  isApproveToActive: boolean;
  name: string;
  email: string;
  description: string;
  image?: string;
  previewImages?: string[];
  address: string;
  phone: string;
  followers?: IFollower[];
}

const schema = new Schema<ICompany>(
  {
    isApproveToActive: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    previewImages: {
      type: [String],
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    followers: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        notificationType: {
          type: String,
          enum: Object.values(NotificationType),
          default: NotificationType.ONLY_SPECIAL,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

schema.index({ name: 1 });

const CompanyModel = model('Company', schema);
export default CompanyModel;
