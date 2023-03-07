import mongoose, { Schema, model, Types } from 'mongoose';

export enum TicketStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface TicketInterface {
  userId: Types.ObjectId;
  tourId: Types.ObjectId;
  status: TicketStatus;
  price: number;
}

const ticketSchema = new Schema<TicketInterface>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

ticketSchema.index({ userId: 1 });
ticketSchema.index({ tourId: 1 });

const Ticket = model('Ticket', ticketSchema);

export default Ticket;
