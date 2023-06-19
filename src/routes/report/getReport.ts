import { BadRequestError, ForbiddenError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import TouristsRouteModel from '../../database/model/Company/TouristsRoute';
import { ReportModel, ReportType } from '../../database/model/Report';
import ReportRepo from '../../database/repository/ReportRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest, PublicRequest } from '../../types/app-request';

export const getAllReport = asyncHandler(async (req: PublicRequest, res) => {
  const report = await ReportModel.find({}, null, { sort: { createdAt: -1 } });

  return new SuccessResponse('success', report).send(res);
});

export const getApplicationReport = asyncHandler(
  async (req: PublicRequest, res) => {
    const report = await ReportModel.find(
      {
        reportType: ReportType.APPLICATION,
      },
      null,
      { sort: { createdAt: -1 } },
    );

    return new SuccessResponse('success', report).send(res);
  },
);

export const getCompanyReport = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const report = await ReportModel.find(
      {
        reportType: ReportType.COMPANY,
      },
      null,
      { sort: { createdAt: -1 } },
    );

    return new SuccessResponse('success', report).send(res);
  },
);

export const getRouteReport = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const report = await ReportModel.find(
      {
        reportType: ReportType.ROUTE,
      },
      null,
      { sort: { createdAt: -1 } },
    );

    return new SuccessResponse('success', report).send(res);
  },
);
