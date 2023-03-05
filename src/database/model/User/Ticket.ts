import mongoose, { Schema, model, Types } from 'mongoose';

export enum TicketStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface TicketInterface {
  userId: Types.ObjectId;
  tourRouteId: Types.ObjectId;
  status: TicketStatus;
  price: number;
}

const ticketSchema = new Schema<TicketInterface>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tourRouteId: {
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

ticketSchema.index({ userId: 1 });
ticketSchema.index({ tourRouteId: 1 });

const Ticket = model('Ticket', ticketSchema);

export default Ticket;
