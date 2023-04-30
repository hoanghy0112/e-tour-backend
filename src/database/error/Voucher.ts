export enum VoucherErrorType {
  EXPIRED_VOUCHER = 'EXPIRED_VOUCHER',
  VOUCHER_NOT_FOUND = 'VOUCHER_NOT_FOUND',
}

export class VoucherError extends Error {
  constructor(public type: VoucherErrorType, public message: string = 'error') {
    super(type);
  }
}
