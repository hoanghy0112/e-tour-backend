import { Schema, model, Types } from 'mongoose';

export enum StaffRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum Permission {
  EDIT_ROUTE = 'edit-route',
  EDIT_TOUR = 'edit-tour',
  EDIT_VOUCHER = 'edit-voucher',
  EDIT_COMPANY = 'edit-company',
  VIEW_TICKETS = 'view-tickets',
}

export const SuperStaffPermission = [
  Permission.EDIT_COMPANY,
  Permission.EDIT_ROUTE,
  Permission.EDIT_TOUR,
  Permission.EDIT_VOUCHER,
  Permission.VIEW_TICKETS,
];

export interface StaffInterface {
  fullName: string;
  image?: string;
  role: StaffRole;
  permissions: Permission[];
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
    permissions: [Permission],
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
