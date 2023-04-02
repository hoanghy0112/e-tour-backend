import { Schema, model, Types } from 'mongoose';

export enum TourType {
  NORMAL = 'normal',
  PROMOTION = 'promotion',
}

export interface Tour {
  // departureAt: Date;
  from: Date;
  to: Date;
  type: TourType;
  image: string;
  touristRoute: Types.ObjectId;
}

const tourSchema = new Schema<Tour>(
  {
    from: {
      type: Date,
      default: Date.now(),
    },
    to: {
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
    touristRoute: {
      type: Schema.Types.ObjectId,
      ref: 'TouristsRoute',
    },
  },
  {
    timestamps: true,
  },
);

const TourModel = model('Tour', tourSchema);

export default TourModel;
