import { Schema, model, Types } from 'mongoose';

export interface RateInterface {
  star: number;
  description: string;
  user: Types.ObjectId;
  company?: Types.ObjectId;
  staff?: Types.ObjectId;
  tour?: Types.ObjectId;
}

const rateSchema = new Schema<RateInterface>(
  {
    star: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
    },
  },
  {
    timestamps: true,
  },
);

rateSchema.index({ user: 1 });
rateSchema.index({ company: 1 });
rateSchema.index({ staff: 1 });
rateSchema.index({ tour: 1 });

const Rate = model('Rate', rateSchema);

export default Rate;
