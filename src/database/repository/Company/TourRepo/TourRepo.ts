import { Types } from 'mongoose';
import TourModel, { Tour } from '../../../model/Company/Tour';

async function create(tour: Tour): Promise<Tour | null> {
  const createdTour = await TourModel.create(tour);
  return createdTour;
}

async function findById(id: Types.ObjectId | string): Promise<Tour | null> {
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
}): Promise<Tour[]> {
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
