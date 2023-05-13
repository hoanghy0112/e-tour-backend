import { BadRequestError } from '../../../core/ApiError';
import { VoucherError, VoucherErrorType } from '../../error/Voucher';
import VoucherModel, { IVoucher } from '../../model/User/Voucher';

async function getDiscountValue(voucherId: string): Promise<number> {
  const voucher = await VoucherModel.findById(voucherId);

  if (voucher) {
    if (voucher.expiredAt < new Date()) {
      return voucher.value;
    }
    throw new VoucherError(
      VoucherErrorType.EXPIRED_VOUCHER,
      voucher.expiredAt.toString(),
    );
  }

  throw new VoucherError(
    VoucherErrorType.VOUCHER_NOT_FOUND,
    voucherId.toString(),
  );
}

async function viewById(id: string): Promise<IVoucher> {
  try {
    const voucher = await VoucherModel.findById(id);
    if (!voucher) throw new BadRequestError('id not found');
    return voucher;
  } catch (e: any) {
    throw new BadRequestError(e.message);
  }
}

async function viewNewest(num: number): Promise<IVoucher[]> {
  const vouchers = await VoucherModel.find({}, '_id createdAt')
    .sort({ createdAt: -1 })
    .limit(num);

  return vouchers;
}

async function create(voucher: IVoucher): Promise<IVoucher> {
  const voucherDoc = await VoucherModel.create(voucher);

  return voucherDoc;
}

export default {
  getDiscountValue,
  viewById,
  viewNewest,
  create,
};
