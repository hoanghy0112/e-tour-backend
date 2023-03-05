import { Schema, model, Types } from 'mongoose';

export interface InterestInterface {
  // company: Types.ObjectId;
  touristsRouteId: Types.ObjectId;
  userId: Types.ObjectId;
}

const interestSchema = new Schema<InterestInterface>({
  // company: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Company',
  // },
  touristsRouteId: {
    type: Schema.Types.ObjectId,
    ref: 'TouristsRoute',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

interestSchema.index({ touristsRouteId: 1 });
interestSchema.index({ userId: 1 });

const Interest = model('Interest', interestSchema);

export default Interest;
