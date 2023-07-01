import { Schema, model, Types } from 'mongoose';
import watch from '../../../helpers/realtime/watch';

export enum VoucherType {
  DISCOUNT = 'discount',
  FREE = 'free',
  NORMAL = 'normal',
}

export interface IVoucher {
  _id?: Types.ObjectId;
  name: string;
  companyId: Types.ObjectId;
  expiredAt: Date;
  type: VoucherType;
  description: string;
  image?: string | Buffer;
  backgroundImage?: string | Buffer;
  usingCondition: string;
  value: number;
  min: number;
  max: number;
  num: number;
}

const voucherSchema = new Schema<IVoucher>(
  {
    expiredAt: {
      type: Date,
      default: Date.now(),
    },
    name: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: Object.values(VoucherType),
    },
    description: {
      type: String,
    },
    usingCondition: {
      type: String,
    },
    image: {
      type: String,
    },
    backgroundImage: {
      type: String,
    },
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
    num: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  },
);

voucherSchema.index({ companyId: 1 });

const VoucherModel = model('Voucher', voucherSchema);

VoucherModel.watch().on('change', watch<IVoucher>(VoucherModel));

export default VoucherModel;
