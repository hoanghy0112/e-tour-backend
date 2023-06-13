import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Report';
export const COLLECTION_NAME = 'reports';

export enum ReportType {
  TOUR = 'tour',
  ROUTE = 'route',
  COMPANY = 'company',
  STAFF = 'staff',
  APPLICATION = 'application',
}

export default interface IReport {
  _id: Types.ObjectId;
  reportType: ReportType;
  objectId: Types.ObjectId;
  content: string;
}

const schema = new Schema<IReport>(
  {
    reportType: {
      type: String,
      enum: Object.values(ReportType),
    },
    objectId: {
      type: Schema.Types.ObjectId,
    },
    content: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ReportModel = model<IReport>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
