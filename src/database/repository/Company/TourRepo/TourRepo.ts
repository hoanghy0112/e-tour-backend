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
import TicketModel from '../../../model/User/Ticket';

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

async function findById(id: Types.ObjectId | string): Promise<any> {
  const createdTour = await TourModel.findById(id);
  const tickets = await TicketModel.find({ tourId: id });

  if (!createdTour) throw new TourError(TourErrorType.TOUR_NOT_FOUND);

  return {
    ...createdTour.toObject(),
    customer: tickets.length,
  };
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

async function remove(id: string | Types.ObjectId) {
  return TourModel.findByIdAndDelete(id);
}

async function update(
  id: string | Types.ObjectId | undefined,
  tourData: ITour,
) {
  return TourModel.findByIdAndUpdate(id, tourData, { new: true });
}

export default {
  create,
  findById,
  filter,
  remove,
  update,
};
