import { Types } from 'mongoose';
import { BadRequestError } from '../../../core/ApiError';
import { VoucherError, VoucherErrorType } from '../../error/Voucher';
import CompanyModel, {
  ICompany,
  IFollower,
  NotificationType,
} from '../../model/Company/Company';
import UserModel, { IUser } from '../../model/User/User';
import VoucherModel, { IVoucher } from '../../model/User/Voucher';

async function getDiscountValue(voucherId: string): Promise<IVoucher> {
  const voucher = await VoucherModel.findById(voucherId);

  if (voucher) {
    if (voucher.expiredAt > new Date()) {
      return voucher;
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
    const voucher = await VoucherModel.findById(id).populate('companyId');
    if (!voucher) throw new BadRequestError('id not found');
    return voucher;
  } catch (e: any) {
    throw new BadRequestError(e.message);
  }
}

async function viewNewest(num: number): Promise<IVoucher[]> {
  const vouchers = await VoucherModel.find({})
    .populate('companyId')
    .sort({ createdAt: -1 })
    .limit(num);

  return vouchers;
}

async function create(voucher: IVoucher): Promise<IVoucher> {
  const voucherDoc = await VoucherModel.create(voucher);

  (async () => {
    const companyId = voucher.companyId.toString();
    const company = (await CompanyModel.findById(companyId).populate(
      'followers',
    )) as ICompany;

    company.followers?.forEach(async (follower: IFollower) => {
      const notificationType = follower.notificationType;
      const user = follower.user;

      const notification = {
        title: `New voucher from ${company.name}`,
        content: `Voucher ${voucher.name} has been created, click to view detail`,
        link: `voucher-${voucherDoc._id.toString()}/new`,
        image: voucherDoc.image,
      };

      if (notificationType == NotificationType.ALL) {
        await UserModel.findByIdAndUpdate(user._id, {
          $addToSet: {
            notifications: notification,
          },
        });
      } else if (notificationType == NotificationType.ONLY_SPECIAL) {
        if (Math.floor(Math.random() * 2) == 0)
          await UserModel.findByIdAndUpdate(user._id, {
            $addToSet: {
              notifications: notification,
            },
          });
      }
    });
  })();

  return voucherDoc;
}

async function addToSaved(
  userId: string | Types.ObjectId | undefined,
  voucherId: string | Types.ObjectId,
) {
  const updatedUser = (await UserModel.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        savedVouchers: voucherId,
      },
    },
    { new: true },
  )) as IUser;
  return updatedUser.savedVouchers || [];
}

async function removeFromSaved(
  userId: string | Types.ObjectId | undefined,
  voucherId: string | Types.ObjectId,
) {
  const updatedUser = (await UserModel.findByIdAndUpdate(
    userId,
    {
      $pull: {
        savedVouchers: voucherId,
      },
    },
    { new: true },
  )) as IUser;
  return updatedUser.savedVouchers || [];
}

async function viewSaved(userId: string | Types.ObjectId | undefined) {
  const updatedUser = (await UserModel.findById(userId)) as IUser;
  return updatedUser.savedVouchers || [];
}

export default {
  getDiscountValue,
  viewById,
  viewNewest,
  create,
  addToSaved,
  removeFromSaved,
  viewSaved,
};
