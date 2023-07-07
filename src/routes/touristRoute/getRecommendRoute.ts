import { SuccessResponse } from '../../core/ApiResponse';
import TouristsRouteModel from '../../database/model/Company/TouristsRoute';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../types/app-request';

export const getRecommendRouteOfCompany = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const query = req.query;

    const data = await TouristsRouteModel.aggregate([
      {
        $match: query,
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
    ]);

    return new SuccessResponse('success', data).send(res);
  },
);
