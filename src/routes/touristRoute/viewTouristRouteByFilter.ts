import { SuccessResponse } from '../../core/ApiResponse';
import TouristsRouteModel from '../../database/model/Company/TouristsRoute';
import RateRepo from '../../database/repository/User/RateRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';

export const viewTouristRouteByFilter = asyncHandler(
  async (req: PublicRequest, res) => {
    const query = req.query;

    const data = await TouristsRouteModel.aggregate([
      {
        $match: {
          route: 'TP Hồ Chí Minh',
        },
      },
      {
        $lookup: {
          from: 'rates',
          localField: '_id',
          foreignField: 'touristsRouteId',
          as: 'rates',
        },
      },
      {
        $addFields: {
          rate: {
            $ifNull: [
              {
                $avg: '$rates.star',
              },
              0,
            ],
          },
          num: {
            $size: '$rates',
          },
        },
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company',
        },
      },
      {
        $unwind: {
          path: '$company',
          includeArrayIndex: '__companyIndex',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unset: ['followers', 'rates', 'company.followers'],
      },
    ]).exec();

    // const data = await TouristsRouteModel.find(query);

    // const dataWithRating = await Promise.all(
    //   data.map(async (route) => ({
    //     ...route.toObject(),
    //     ...(await RateRepo.getOverallRatingOfRoute(route._id)),
    //   })),
    // );

    return new SuccessResponse('success', data).send(res);
  },
);

export const viewTouristRouteByDestination = asyncHandler(
  async (req: PublicRequest, res) => {
    const destination = req.query?.destination;

    // const data = await TouristsRouteModel.find(query);
    // const data = TouristsRouteModel.find({
    //   route: destination,
    // });

    const data = TouristsRouteModel.aggregate([
      {
        $match: {
          route: destination,
        },
      },
      {
        $lookup: {
          from: 'rates',
          localField: '_id',
          foreignField: 'touristsRouteId',
          as: 'rates',
        },
      },
      {
        $addFields: {
          rate: {
            $avg: '$rates.star',
          },
          num: {
            $size: '$rates',
          },
        },
      },
    ]);

    return new SuccessResponse('success', data).send(res);
  },
);
