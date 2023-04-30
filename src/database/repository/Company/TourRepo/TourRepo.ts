import { Types } from 'mongoose';
import TourModel, { ITour } from '../../../model/Company/Tour';

async function create(tour: ITour): Promise<ITour | null> {
  const createdTour = await TourModel.create(tour);
  return createdTour;
}

async function findById(id: Types.ObjectId | string): Promise<ITour | null> {
  const createdTour = await TourModel.findById(id);
  return createdTour;
}

async function filter({
  touristRoute,
  from,
  to,
}: {
  touristRoute: string | Types.ObjectId;
  from: Date;
  to: Date;
}): Promise<ITour[]> {
  const tour = await TourModel.find({
    $and: [
      touristRoute
        ? {
            touristRoute,
          }
        : {},
      from
        ? {
            from: {
              $gt: from,
            },
          }
        : {},
      to
        ? {
            to: {
              $lt: to,
            },
          }
        : {},
    ],
  });
  return tour || [];
}

export default {
  create,
  findById,
  filter,
};
