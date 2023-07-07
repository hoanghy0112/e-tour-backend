import { Types } from 'mongoose';
import { SuccessResponse } from '../../core/ApiResponse';
import TouristsRouteModel from '../../database/model/Company/TouristsRoute';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../types/app-request';

export const getRecommendRouteByFilter = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const { companyId, size = 5, ...query } = req.query;

    const data = await TouristsRouteModel.aggregate([
      {
        $match: {
          companyId: companyId
            ? new Types.ObjectId(companyId?.toString())
            : null,
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
      {
        $sample: { size: parseInt(size?.toString()) },
      },
    ]);

    return new SuccessResponse('success', data).send(res);
  },
);

export const getRecommendRouteByRouteId = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const { routeId, size = 5 } = req.query;

    const data = await TouristsRouteModel.aggregate([
      {
        $match: {},
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
      {
        $sample: { size: parseInt(size?.toString()) },
      },
    ]);

    return new SuccessResponse('success', data).send(res);
  },
);
