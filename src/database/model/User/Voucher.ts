import { Schema, model, Types } from 'mongoose';

export enum VoucherType {
  DISCOUNT = 'discount',
  FREE = 'free',
  NORMAL = 'normal',
}

export interface VoucherInterface {
  expiredAt: Date;
  type: VoucherType;
  description: string;
  usingCondition: string;
  image?: string;
  value: number;
  company: Types.ObjectId;
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
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
  },
);

voucherSchema.index({ company: 1 });

const Voucher = model('Voucher', voucherSchema);

module.exports = Voucher;
