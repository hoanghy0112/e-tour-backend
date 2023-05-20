import { Types } from 'mongoose';
import TouristsRouteModel, {
  ITouristsRoute,
} from '../../../model/Company/TouristsRoute';
import { RouteError, RouteErrorType } from '../../../error/TouristRoute';
import RateRepo from '../../User/RateRepo';
import TourModel, { ITour } from '../../../model/Company/Tour';
import TourRepo from '../TourRepo/TourRepo';
import UserModel from '../../../model/User/User';
import { BadRequestError } from '../../../../core/ApiError';
import CompanyModel, {
  ICompany,
  IFollower,
  NotificationType,
} from '../../../model/Company/Company';

async function create(
  tourRoute: ITouristsRoute,
): Promise<ITouristsRoute | null> {
  const createdTourRoute = (await TouristsRouteModel.create(
    tourRoute,
  )) as ITouristsRoute;

  (async () => {
    const companyId = tourRoute.companyId.toString();
    const company = (await CompanyModel.findById(companyId).populate(
      'followers',
    )) as ICompany;

    company.followers?.forEach(async (follower: IFollower) => {
      const notificationType = follower.notificationType;
      const user = follower.user;

      const notification = {
        title: `New tourist route for you`,
        content: `${company.name} has created a new tourist route for you.`,
        link: `tour-${tourRoute._id.toString()}/new`,
        image: createdTourRoute.images?.[0],
      };

      if (notificationType == NotificationType.ALL) {
        await UserModel.findByIdAndUpdate(user._id, {
          $addToSet: {
            notifications: notification,
          },
        });
      } else if (notificationType == NotificationType.ONLY_SPECIAL) {
        if (Math.floor(Math.random() * 2) == 0)
          await UserModel.findByIdAndUpdate(user._id, {
            $addToSet: {
              notifications: notification,
            },
          });
      }
    });
  })();

  return createdTourRoute;
}

async function list(
  companyId: string | Types.ObjectId,
): Promise<ITouristsRoute[] | null> {
  const tourRoutes = await TouristsRouteModel.find({ companyId });
  return tourRoutes;
}

async function findById(
  id: string | Types.ObjectId,
): Promise<ITouristsRoute & { rate: number }> {
  const tourRoute = await TouristsRouteModel.findById(id);

  if (!tourRoute) throw new RouteError(RouteErrorType.ROUTE_NOT_FOUND);

  const rate = await RateRepo.getOverallRatingOfRoute(id);

  return {
    ...JSON.parse(JSON.stringify(tourRoute)),
    ...rate,
  };
}

async function findRecommend(num = 1) {
  const recommendedRoutes = await TouristsRouteModel.find({}, null, {
    sort: { createdAt: -1 },
  });

  return Promise.all(
    recommendedRoutes.map(async (route) => ({
      ...JSON.parse(JSON.stringify(route)),
      ...(await RateRepo.getOverallRatingOfRoute(route._id)),
    })),
  );
}

async function edit(
  id: string | Types.ObjectId,
  data: ITouristsRoute,
): Promise<ITouristsRoute | null> {
  const tourRoute = await TouristsRouteModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return tourRoute;
}

async function filter({
  route,
  keyword,
}: {
  route: string[];
  keyword: string;
}) {
  const touristRoutes = await TouristsRouteModel.find({
    $and: [
      route && route.length > 0
        ? {
            route: {
              $all: route,
            },
          }
        : {},
      keyword
        ? {
            name: {
              $regex: keyword,
              $options: 'i',
            },
          }
        : {},
    ],
  }).sort({ createdAt: -1 });

  return Promise.all(
    touristRoutes.map(async (route) => ({
      ...JSON.parse(JSON.stringify(route)),
      ...(await RateRepo.getOverallRatingOfRoute(route._id)),
    })),
  );
}

async function findSaved(
  userId: string | Types.ObjectId | undefined,
): Promise<ITouristsRoute[]> {
  if (!userId) throw new BadRequestError('userId not found');

  const user = await UserModel.findById(userId, { savedRoutes: 1 }).populate({
    path: 'savedRoutes',
  });

  const routes = user?.toObject().savedRoutes;
  if (!routes) return [];

  routes?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return Promise.all(
    routes.map(async (route) => ({
      ...JSON.parse(JSON.stringify(route)),
      ...(await RateRepo.getOverallRatingOfRoute(route._id)),
    })),
  );
}

async function addToSaved(
  routeId: string | Types.ObjectId,
  userId: string | Types.ObjectId,
): Promise<void> {
  await UserModel.findByIdAndUpdate(userId, {
    $addToSet: {
      savedRoutes: routeId,
    },
  });
}

async function removeFromSaved(
  routeId: string | Types.ObjectId,
  userId: string | Types.ObjectId,
): Promise<void> {
  await UserModel.findByIdAndUpdate(userId, {
    $pull: {
      savedRoutes: routeId,
    },
  });
}

async function increasePoint(routedId: Types.ObjectId | string, point: number) {
  // Remove that point to make the route with more recent point become popular
  setTimeout(() => {
    TouristsRouteModel.findByIdAndUpdate(
      routedId,
      {
        $inc: {
          point: -point,
        },
      },
      { new: true },
    );
  }, 604_800_000);

  return await TouristsRouteModel.findByIdAndUpdate(
    routedId,
    {
      $inc: {
        point,
      },
    },
    { new: true },
  );
}

async function findPopular(
  num: number,
  skip = 0,
): Promise<(ITouristsRoute & { rate: number; num: number })[]> {
  const routes = await TouristsRouteModel.find({})
    .sort({ point: -1 })
    .limit(num)
    .skip(skip);

  return Promise.all(
    routes.map(async (route) => ({
      ...route.toObject(),
      ...(await RateRepo.getOverallRatingOfRoute(route._id)),
    })),
  );
}

export default {
  create,
  list,
  filter,
  findById,
  findRecommend,
  findPopular,
  edit,
  findSaved,
  addToSaved,
  removeFromSaved,
  increasePoint,
};
