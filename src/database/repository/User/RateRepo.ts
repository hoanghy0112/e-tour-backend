import { Types } from 'mongoose';
import RateModel, { IRate } from '../../model/User/Rate';
import { RateError, RateErrorType } from '../../error/Rate';

async function createRouteRate(rateInfo: IRate): Promise<IRate> {
  const userId = rateInfo.userId;
  const routeId = rateInfo.touristsRouteId;

  const createdRate = await RateModel.findOneAndUpdate(
    { touristsRouteId: routeId, userId },
    rateInfo,
    { upsert: true, new: true },
  ).populate('userId');

  return createdRate;
}

async function findById(id: string | Types.ObjectId) {
  const rate = await RateModel.findById(id);

  if (!rate) throw new RateError(RateErrorType.RATE_NOT_FOUND);

  return rate;
}

async function getOverallRatingOfRoute(
  touristsRouteId: string | Types.ObjectId,
) {
  const rateList = (await RateModel.find({ touristsRouteId })) as IRate[];

  const totalStar = rateList.reduce((total, rate) => total + rate.star, 0);

  return {
    rate: rateList.length ? totalStar / rateList.length : 0,
    num: rateList.length,
  };
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
  createRouteRate,
  findById,
  getOverallRatingOfRoute,
  getDetailRatingOfRoute,
};
