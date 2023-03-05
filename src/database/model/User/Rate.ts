import { Schema, model, Types } from 'mongoose';

export interface RateInterface {
  star: number;
  description: string;
  userId: Types.ObjectId;
  companyId?: Types.ObjectId;
  staffId?: Types.ObjectId;
  touristsRouteId?: Types.ObjectId;
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
    },
    touristsRouteId: {
      type: Schema.Types.ObjectId,
      ref: 'TouristsRoute',
    },
  },
  {
    timestamps: true,
  },
);

rateSchema.index({ userId: 1 });
rateSchema.index({ companyId: 1 });
rateSchema.index({ staffId: 1 });
rateSchema.index({ touristsRouteId: 1 });

const Rate = model('Rate', rateSchema);

export default Rate;
