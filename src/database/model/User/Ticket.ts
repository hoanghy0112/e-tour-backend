import mongoose, { Schema, model, Types } from 'mongoose';
import watch from '../../../helpers/realtime/watch';

export enum PaymentStatus {
  PENDING = 'pending',
  CHECKED_OUT = 'checked_out',
}

export interface ITicketVisitor {
  name: string;
  age?: number;
  address?: string;
  phoneNumber?: string;
  request?: string;
}

export interface ITicket {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  tourId: Types.ObjectId | string;
  status: PaymentStatus;
  fullName: string;
  phoneNumber: string;
  email: string;
  visitors: ITicketVisitor[];
  specialRequirement: string;
  pickupLocation: string;
  price?: number;
}

const schema = new Schema<ITicket>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Tour',
    },
    fullName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    price: {
      type: Number,
      default: 0,
    },
    visitors: [
      {
        name: {
          type: String,
          default: '',
          required: false,
        },
        age: {
          type: Number,
          default: 0,
          required: false,
        },
        address: {
          type: String,
          required: false,
          default: '',
        },
        phoneNumber: {
          type: Number,
          required: false,
          default: '',
        },
        request: {
          type: String,
          required: false,
          default: '',
        },
      },
    ],
    specialRequirement: {
      type: String,
      default: '',
    },
    pickupLocation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

schema.index({ userId: 1 });
schema.index({ tourId: 1 });

const TicketModel = model('Ticket', schema);

TicketModel.watch().on('change', watch<ITicket>(TicketModel));

export default TicketModel;
