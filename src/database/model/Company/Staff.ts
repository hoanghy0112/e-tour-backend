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

export const AdminPermission = [
  Permission.EDIT_COMPANY,
  Permission.EDIT_ROUTE,
  Permission.EDIT_TOUR,
  Permission.EDIT_VOUCHER,
  Permission.VIEW_TICKETS,
];

export interface Staff {
  fullName: string;
  image?: string;
  role: StaffRole;
  permissions: Permission[];
  companyId: Types.ObjectId;
  credentialId?: Types.ObjectId;
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
        enum: Object.values(Permission),
      },
    ],
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    credentialId: { type: Schema.Types.ObjectId, ref: 'Credential' },
  },
  {
    timestamps: true,
  },
);

export const StaffModel = model('Staff', schema);
