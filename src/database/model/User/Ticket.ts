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
  visitors: ITicketVisitor[];
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
          required: true,
        },
        age: {
          type: Number,
          required: false,
        },
        address: {
          type: String,
          default: '',
        },
        phoneNumber: {
          type: Number,
          default: '',
        },
        request: {
          type: String,
          default: '',
        },
      },
    ],
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
