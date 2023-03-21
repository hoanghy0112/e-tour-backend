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

export default {
  create,
  list,
};
