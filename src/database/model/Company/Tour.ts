import { Schema, model, Types } from 'mongoose';
import watch from '../../../helpers/realtime/watch';
import { INotification } from '../User/User';

export enum TourType {
  NORMAL = 'normal',
  PROMOTION = 'promotion',
}

export interface ITour {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  from: Date;
  to: Date;
  type: TourType;
  image?: string | null;
  touristRoute: Types.ObjectId;
  price: number;
  notifications?: INotification[];
}

const tourSchema = new Schema<ITour>(
  {
    name: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
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
    price: {
      type: Number,
      default: 0,
    },
    notifications: [
      {
        title: String,
        content: String,
        link: String,
        image: String,
        isRead: {
          type: Boolean,
          default: false,
        },
        createdAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const TourModel = model('Tour', tourSchema);

TourModel.watch().on('change', watch<ITour>(TourModel));

export default TourModel;
