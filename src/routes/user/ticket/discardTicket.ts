import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import { ICard } from '../../../database/model/User/User';
import CardRepo from '../../../database/repository/User/CardRepo';
import TicketRepo from '../../../database/repository/User/TicketRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedUserRequest } from '../../../types/app-request';

export const discardTicket = asyncHandler(
  async (req: ProtectedUserRequest, res) => {
    const userId = req.user?._id;
    const { ticketId } = req.params;

    if (!userId) throw new BadRequestError('userId not found');

    await TicketRepo.deleteTicket(ticketId);

    return new SuccessResponse('success', { ticketId }).send(res);
  },
);
