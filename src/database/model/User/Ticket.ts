import mongoose, { Schema, model, Types } from 'mongoose';

export enum TicketStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface TicketInterface {
  user: Types.ObjectId;
  tour: Types.ObjectId;
  status: TicketStatus;
  price: number;
}

const ticketSchema = new Schema<TicketInterface>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
    },
    status: TicketStatus,
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

ticketSchema.index({ user: 1 });
ticketSchema.index({ tour: 1 });

const Ticket = model('Ticket', ticketSchema);

export default Ticket;
