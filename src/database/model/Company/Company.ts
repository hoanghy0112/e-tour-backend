import { Schema, Types, model } from 'mongoose';
import { IUser } from '../User/User';
import watch from '../../../helpers/realtime/watch';

export enum NotificationType {
  ALL = 'all',
  ONLY_SPECIAL = 'only-special',
  NONE = 'none',
}

export interface IFollower {
  user: IUser;
  notificationType: NotificationType;
}

export enum ProfileState {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface ICompany {
  _id?: Types.ObjectId;
  isApproveToActive: boolean;
  profileState?: ProfileState;
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
    profileState: { type: String, default: ProfileState.PENDING },
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
CompanyModel.watch().on('change', watch<ICompany>(CompanyModel));

export default CompanyModel;
