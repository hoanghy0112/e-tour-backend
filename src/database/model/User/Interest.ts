import { Schema, model, Types } from 'mongoose';

export interface InterestInterface {
  // company: Types.ObjectId;
  tour: Types.ObjectId;
  userId: Types.ObjectId;
}

const interestSchema = new Schema<InterestInterface>({
  // company: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Company',
  // },
  tour: {
    type: Schema.Types.ObjectId,
    ref: 'Tour',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

interestSchema.index({ tour: 1 });
interestSchema.index({ userId: 1 });

const Interest = model('Interest', interestSchema);

export default Interest;
