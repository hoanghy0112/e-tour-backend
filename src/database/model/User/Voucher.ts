import { Schema, model, Types } from 'mongoose';

export enum VoucherType {
  DISCOUNT = 'discount',
  FREE = 'free',
  NORMAL = 'normal',
}

export interface VoucherInterface {
  companyId: Types.ObjectId;
  expiredAt: Date;
  type: VoucherType;
  description: string;
  image?: string;
  usingCondition: string;
  value: number;
}

const voucherSchema = new Schema<VoucherInterface>(
  {
    expiredAt: {
      type: Date,
      default: Date.now(),
    },
    type: VoucherType,
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

const Voucher = model('Voucher', voucherSchema);

module.exports = Voucher;
