import { Types } from 'mongoose';
import TourModel, { ITour } from '../../../model/Company/Tour';
import { TourError, TourErrorType } from '../../../error/Tour';
import RateRepo from '../../User/RateRepo';

async function create(tour: ITour): Promise<ITour | null> {
  const createdTour = await TourModel.create(tour);
  return createdTour;
}

async function findById(id: Types.ObjectId | string): Promise<ITour> {
  const createdTour = await TourModel.findById(id);

  if (!createdTour) throw new TourError(TourErrorType.TOUR_NOT_FOUND);

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
