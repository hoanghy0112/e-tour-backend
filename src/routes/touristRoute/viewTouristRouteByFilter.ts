import { Types } from 'mongoose';
import { SuccessResponse } from '../../core/ApiResponse';
import TouristsRouteModel from '../../database/model/Company/TouristsRoute';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';

export const viewTouristRouteByFilter = asyncHandler(
  async (req: PublicRequest, res) => {
    const { companyId, ...query } = req.query;

    const data = await TouristsRouteModel.aggregate([
      {
        $match: {
          ...(companyId
            ? { companyId: new Types.ObjectId(companyId?.toString()) }
            : {}),
          ...query,
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

    return new SuccessResponse('success', data).send(res);
  },
);
