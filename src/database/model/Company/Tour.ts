import { Schema, model, Types } from 'mongoose';

export enum TourType {
  NORMAL = 'normal',
  PROMOTION = 'promotion',
}

export interface Tour {
  departureAt: Date;
  type: TourType;
  image: string;
  touristsRoute: Types.ObjectId;
}

const tourSchema = new Schema(
  {
    departureAt: {
      type: Date,
      default: Date.now(),
    },
    type: {
      type: String,
      enum: Object.values(TourType),
    },
    image: {
      type: String,
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

const TourModel = model('Tour', tourSchema);

module.exports = TourModel;
