import { ReportModel, ReportType } from '../model/Report';

async function create(
  objectId: string,
  reportType: ReportType,
  content: string,
) {
  const report = await ReportModel.create({
    objectId,
    reportType,
    content,
  });

  return report;
}

export default {
  create,
};
