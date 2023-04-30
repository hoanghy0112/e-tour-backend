import { Schema, model, Types } from 'mongoose';
import watch from '../../../helpers/realtime/watch';

export enum RateType {
  ROUTE = 'route',
  COMPANY = 'company',
  STAFF = 'staff',
}

export interface IRate {
  _id?: Types.ObjectId | string;
  star: number;
  description: string;
  userId: Types.ObjectId;
  rateType: RateType;
  companyId?: Types.ObjectId;
  staffId?: Types.ObjectId;
  touristsRouteId?: Types.ObjectId;
}

const rateSchema = new Schema<IRate>(
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
    rateType: {
      type: String,
      enum: Object.values(RateType),
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

const RateModel = model('Rate', rateSchema);

RateModel.watch().on('change', watch<IRate>(RateModel));

export default RateModel;
