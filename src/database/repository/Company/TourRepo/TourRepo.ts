import { Types } from 'mongoose';
import { BadRequestError } from '../../../../core/ApiError';
import { TourError, TourErrorType } from '../../../error/Tour';
import { IFollower } from '../../../model/Company/Company';
import TourModel, { ITour } from '../../../model/Company/Tour';
import TouristsRouteModel, {
  ITouristsRoute,
} from '../../../model/Company/TouristsRoute';
import { INotification } from '../../../model/User/User';
import NotificationRepo from '../../NotificationRepo';

async function create(tour: ITour): Promise<ITour | null> {
  try {
    const createdTour = await TourModel.create(tour);

    (async () => {
      const routeId = tour.touristRoute.toString();
      const route = (await TouristsRouteModel.findById(routeId).populate(
        'followers',
      )) as ITouristsRoute;

      route.followers.forEach(async (follower: IFollower) => {
        const notificationType = follower.notificationType;
        const user = follower.user;

        const notification = {
          title: `E-Tour notification`,
          content: `${route.name} has created a new tour for you.`,
          link: `route-${createdTour.touristRoute.toString()}/newTour`,
          image: createdTour.image,
          isRead: false,
          createdAt: new Date(),
        } as INotification;

        await NotificationRepo.create(user, notificationType, notification);
      });
    })();

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
