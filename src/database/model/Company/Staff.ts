import { Schema, model, Types } from 'mongoose';

export enum StaffRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export interface StaffInterface {
  fullName: string;
  image?: string;
  role: StaffRole;
  companyId: Types.ObjectId;
}

const staffSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    image: {
      type: String,
    },
    role: StaffRole,
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
  },
);

const Staff = model('Staff', staffSchema);

module.exports = Staff;
