import { BadRequestError, ForbiddenError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import TouristsRouteModel from '../../database/model/Company/TouristsRoute';
import { ReportModel, ReportType } from '../../database/model/Report';
import ReportRepo from '../../database/repository/ReportRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedStaffRequest, PublicRequest } from '../../types/app-request';

export const getApplicationReport = asyncHandler(
  async (req: PublicRequest, res) => {
    const report = await ReportModel.find({
      reportType: ReportType.APPLICATION,
    });

    return new SuccessResponse('success', report).send(res);
  },
);

export const getCompanyReport = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    // const { companyId } = req.params;
    // const staff = req.staff;
    // if (staff?.companyId.toString() != companyId.toString())
    //   throw new ForbiddenError('Different company');
    const companyId = req.staff.companyId;
    const report = await ReportModel.find({
      reportType: ReportType.COMPANY,
      objectId: companyId,
    });

    return new SuccessResponse('success', report).send(res);
  },
);

export const getRouteReport = asyncHandler(
  async (req: ProtectedStaffRequest, res) => {
    const { routeId } = req.params;
    const staff = req.staff;
    const route = await TouristsRouteModel.findById(routeId);
    if (staff?.companyId.toString() != route?.companyId.toString())
      throw new ForbiddenError('Different company');
    const report = await ReportModel.find({
      reportType: ReportType.ROUTE,
      objectId: routeId,
    });

    return new SuccessResponse('success', report).send(res);
  },
);
