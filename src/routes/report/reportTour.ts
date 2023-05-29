import { SuccessResponse } from '../../core/ApiResponse';
import ReportRepo from '../../database/repository/ReportRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';

export const createReport = asyncHandler(async (req: PublicRequest, res) => {
  const { objectId, reportType, content } = req.body;

  const report = await ReportRepo.create(objectId, reportType, content);

  return new SuccessResponse('success', report).send(res);
});
