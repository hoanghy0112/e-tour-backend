import mongoose, { Types } from 'mongoose';
import watch from '../../../helpers/realtime/watch';

export enum TouristsRouteType {
  COUNTRY = 'country',
  FOREIGN = 'foreign',
}

export interface ITouristsRoute {
  _id: Types.ObjectId;
  reservationFee: number;
  name: string;
  description: string;
  type: TouristsRouteType;
  promotionRate: number;
  route: string[];
  images: string[];
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const touristsRouteSchema = new mongoose.Schema<ITouristsRoute>(
  {
    reservationFee: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: false,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    description: {
      type: String,
      required: [true, 'A tour must have a description'],
    },
    type: {
      type: String,
      enum: Object.values(TouristsRouteType),
    },
    promotionRate: {
      type: Number,
      default: 0,
    },
    route: [
      {
        type: String,
      },
    ],
    images: {
      type: [String],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
  },
);

const TouristsRouteModel = mongoose.model('TouristsRoute', touristsRouteSchema);

TouristsRouteModel.watch().on(
  'change',
  watch<ITouristsRoute>(TouristsRouteModel),
);

export default TouristsRouteModel;
