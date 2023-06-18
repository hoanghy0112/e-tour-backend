import { Schema, model, Types } from 'mongoose';
import { Credential } from '../Credential';

export enum StaffRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum StaffPermission {
  EDIT_ROUTE = 'edit-route',
  VIEW_ROUTE = 'view-route',
  DELETE_ROUTE = 'delete-route',
  EDIT_TOUR = 'edit-tour',
  VIEW_TOUR = 'view-tour',
  DELETE_TOUR = 'delete-tour',
  VIEW_VOUCHER = 'view-voucher',
  EDIT_VOUCHER = 'edit-voucher',
  DELETE_VOUCHER = 'delete-voucher',
  EDIT_COMPANY = 'edit-company',
  VIEW_TICKETS = 'view-tickets',
  ADD_STAFF = 'add-staff',
  VIEW_STAFF = 'view-staff',
  REMOVE_STAFF = 'remove-staff',
}

export const AdminPermission = Object.values(StaffPermission);

export interface Staff {
  _id: string;
  fullName: string;
  image?: string;
  role: string;
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
