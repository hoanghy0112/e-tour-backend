import { Schema, model, Types } from 'mongoose';

export interface CompanyInterface {
  isApproveToActive: boolean;
  name: string;
  email: string;
  description: string;
  image: string;
  previewImages: string[];
  address: string;
  phone: string;
}

const companySchema = new Schema<CompanyInterface>(
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

companySchema.index({ name: 1 });

const Company = model('Company', companySchema);

module.exports = Company;
