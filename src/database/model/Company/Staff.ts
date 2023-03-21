import { Schema, model, Types } from 'mongoose';
import { Credential } from '../Credential';

export enum StaffRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum StaffPermission {
  EDIT_ROUTE = 'edit-route',
  EDIT_TOUR = 'edit-tour',
  EDIT_VOUCHER = 'edit-voucher',
  EDIT_COMPANY = 'edit-company',
  VIEW_TICKETS = 'view-tickets',
}

export const AdminPermission = [
  StaffPermission.EDIT_COMPANY,
  StaffPermission.EDIT_ROUTE,
  StaffPermission.EDIT_TOUR,
  StaffPermission.EDIT_VOUCHER,
  StaffPermission.VIEW_TICKETS,
];

export interface Staff {
  _id: string;
  fullName: string;
  image?: string;
  role: StaffRole;
  permissions: StaffPermission[];
  companyId: Types.ObjectId;
  credential: Credential;
}

const schema = new Schema<Staff>(
  {
    fullName: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(StaffRole),
    },
    permissions: [
      {
        type: String,
        enum: Object.values(StaffPermission),
      },
    ],
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    credential: { type: Schema.Types.ObjectId, ref: 'Credential' },
  },
  {
    timestamps: true,
  },
);

export const StaffModel = model('Staff', schema);
