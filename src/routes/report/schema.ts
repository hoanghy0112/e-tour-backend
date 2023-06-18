import Joi from 'joi';
import { ReportType } from '../../database/model/Report';

export default {
  createReport: Joi.object().keys({
    objectId: Joi.string().optional(),
    reportType: Joi.string()
      .allow(...Object.values(ReportType))
      .required(),
    content: Joi.string().required(),
  }),
};
