import { Types } from 'mongoose';
import RateModel, { IRate } from '../../model/User/Rate';
import { RateError, RateErrorType } from '../../error/Rate';

async function create(rateInfo: IRate): Promise<IRate> {
  const createdRate = await RateModel.create(rateInfo);

  return createdRate;
}

async function findById(id: string | Types.ObjectId) {
  const rate = await RateModel.findById(id);

  if (!rate) throw new RateError(RateErrorType.RATE_NOT_FOUND);

  return rate;
}

async function getOverallRatingOfRoute(
  touristsRouteId: string | Types.ObjectId,
): Promise<number> {
  const rateList = (await RateModel.find({ touristsRouteId })) as IRate[];

  const totalStar = rateList.reduce((total, rate) => total + rate.star, 0);

  if (!rateList.length) return 0;

  return totalStar / rateList.length;
}

async function getDetailRatingOfRoute(
  routeId: string | Types.ObjectId,
): Promise<IRate[]> {
  const rateList = (await RateModel.find({
    touristsRouteId: routeId,
  }).populate('userId')) as IRate[];

  return rateList || [];
}

export default {
  create,
  findById,
  getOverallRatingOfRoute,
  getDetailRatingOfRoute,
};
