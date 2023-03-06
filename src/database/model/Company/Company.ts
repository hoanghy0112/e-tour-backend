import { Schema, model, Types } from 'mongoose';

export interface Company {
  _id: Types.ObjectId;
  isApproveToActive: boolean;
  name: string;
  email: string;
  description: string;
  image: string;
  previewImages: string[];
  address: string;
  phone: string;
}

const schema = new Schema<Company>(
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
  },
  {
    timestamps: true,
  },
);

schema.index({ name: 1 });

export const CompanyModel = model('Company', schema);
