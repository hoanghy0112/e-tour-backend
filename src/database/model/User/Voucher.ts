import { Schema, model, Types } from 'mongoose';
import watch from '../../../helpers/realtime/watch';

export enum VoucherType {
  DISCOUNT = 'discount',
  FREE = 'free',
  NORMAL = 'normal',
}

export interface IVoucher {
  companyId: Types.ObjectId;
  expiredAt: Date;
  type: VoucherType;
  description: string;
  image?: string;
  usingCondition: string;
  value: number;
}

const voucherSchema = new Schema<IVoucher>(
  {
    expiredAt: {
      type: Date,
      default: Date.now(),
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
    value: {
      type: Number,
    },
    companyId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Company',
      },
    ],
  },
  {
    timestamps: true,
  },
);

voucherSchema.index({ companyId: 1 });

const VoucherModel = model('Voucher', voucherSchema);

VoucherModel.watch().on('change', watch<IVoucher>(VoucherModel));

export default VoucherModel
