import { Schema, model, Types } from 'mongoose';

export enum TourType {
  NORMAL = 'normal',
  PROMOTION = 'promotion',
}

export interface TourInterface {
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
    type: TourType,
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

const Tour = model('Tour', tourSchema);

module.exports = Tour;
