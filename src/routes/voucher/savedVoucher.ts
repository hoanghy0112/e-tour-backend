import { BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { ICard } from '../../database/model/User/User';
import CardRepo from '../../database/repository/User/CardRepo';
import VoucherRepo from '../../database/repository/User/VoucherRepo';
import asyncHandler from '../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../types/app-request';

export const saveVoucher = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user?._id;
    const { voucherId } = req.body;

    const updatedVouchers = await VoucherRepo.addToSaved(userId, voucherId);

    return new SuccessResponse('success', { updatedVouchers }).send(res);
  },
);

export const removeVoucher = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user?._id;
    const { voucherId } = req.body;

    const updatedVouchers = await VoucherRepo.removeFromSaved(
      userId,
      voucherId,
    );

    return new SuccessResponse('success', { updatedVouchers }).send(res);
  },
);
