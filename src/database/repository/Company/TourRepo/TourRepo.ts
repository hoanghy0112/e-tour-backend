import { Types } from 'mongoose';
import TourModel, { ITour } from '../../../model/Company/Tour';
import { TourError, TourErrorType } from '../../../error/Tour';
import RateRepo from '../../User/RateRepo';
import { BadRequestError } from '../../../../core/ApiError';

async function create(tour: ITour): Promise<ITour | null> {
  try {
    const createdTour = await TourModel.create(tour);
    return createdTour;
  } catch (error) {
    throw new BadRequestError('Invalid id');
  }
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
  const tour = await TourModel.find(
    {
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
    },
    null,
    {
      sort: {
        createdAt: -1,
      },
    },
  );
  return tour || [];
}

export default {
  create,
  findById,
  filter,
};
