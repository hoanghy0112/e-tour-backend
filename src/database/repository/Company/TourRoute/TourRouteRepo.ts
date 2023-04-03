import { Types } from 'mongoose';
import TouristsRouteModel, {
  TouristsRoute,
} from '../../../model/Company/TouristsRoute';

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
): Promise<TouristsRoute | null> {
  const tourRoute = await TouristsRouteModel.findById(id);
  return tourRoute;
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
  });

  return touristRoutes;
}

export default {
  create,
  list,
  filter,
  findById,
  edit,
};
