import { VoucherError, VoucherErrorType } from '../../error/Voucher';
import VoucherModel from '../../model/User/Voucher';

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

export default {
  getDiscountValue,
};
