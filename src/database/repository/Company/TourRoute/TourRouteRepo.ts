import { Types } from 'mongoose';
import TouristsRouteModel, {
  TouristsRoute,
} from '../../../model/Company/TouristsRoute';
import { RouteError, RouteErrorType } from '../../../error/TouristRoute';
import RateRepo from '../../User/RateRepo';
import TourModel, { ITour } from '../../../model/Company/Tour';
import TourRepo from '../TourRepo/TourRepo';

async function create(tourRoute: TouristsRoute): Promise<TouristsRoute | null> {
  const createdTourRoute = await TouristsRouteModel.create(tourRoute);
  return createdTourRoute;
}

async function list(
  companyId: string | Types.ObjectId,
): Promise<TouristsRoute[] | null> {
  const tourRoutes = await TouristsRouteModel.find({ companyId });
  return tourRoutes;
}

async function findById(
  id: string | Types.ObjectId,
): Promise<TouristsRoute & { rate: number }> {
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
  data: TouristsRoute,
): Promise<TouristsRoute | null> {
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

export default {
  create,
  list,
  filter,
  findById,
  findRecommend,
  edit,
};
