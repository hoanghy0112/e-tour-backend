import { Types } from 'mongoose';
import { touristRoutePoint } from '../../../constants/touristRoutePoint';
import { BadRequestError, InternalError } from '../../../core/ApiError';
import TourModel, { ITour } from '../../model/Company/Tour';
import RateModel, { IRate } from '../../model/User/Rate';
import TicketModel, { ITicket } from '../../model/User/Ticket';
import VoucherModel from '../../model/User/Voucher';
import TourRouteRepo from '../Company/TourRoute/TourRouteRepo';
import RateRepo from './RateRepo';
import VoucherRepo from './VoucherRepo';

export async function create({
  ticketInfo,
  voucherIds,
}: {
  ticketInfo: ITicket;
  voucherIds: string[];
}): Promise<ITicket> {
  const tour = (await TourModel.findById(ticketInfo.tourId)) as ITour;
  let finalPrice = tour.price;

  const voucherValues = await Promise.all(
    voucherIds.map((voucherId) => VoucherRepo.getDiscountValue(voucherId)),
  );

  if (voucherValues.some((voucher) => voucher.num == 0))
    throw new BadRequestError(`voucher is out of stock`);

  await VoucherModel.updateMany(
    {
      _id: {
        $in: voucherIds,
      },
    },
    {
      $inc: {
        num: -1,
      },
    },
  );

  let voucherValue = 0;
  voucherValues.forEach(
    (voucher) => voucher.type === 'percent' && (voucherValue += voucher.value),
  );
  finalPrice = finalPrice * Math.max(1 - voucherValue, 0);
  voucherValues.forEach(
    (voucher) => voucher.type === 'money' && (finalPrice -= voucher.value),
  );

  ticketInfo.price = finalPrice;

  const ticket = await TicketModel.create(ticketInfo);

  if (ticket) {
    (async () => {
      TourRouteRepo.increasePoint(
        tour.touristRoute,
        touristRoutePoint.BOOK_TICKET,
      );
    })();

    return ticket;
  }

  throw new InternalError('Something went wrong when create ticket');
}

export async function update(
  id: string,
  userId: string,
  ticketInfo: ITicket,
): Promise<ITicket> {
  const ticket = await TicketModel.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    ticketInfo,
    { new: true },
  );

  if (!ticket) throw new BadRequestError('Can not find ticket');

  return ticket;
}

async function haveCustomerVisitRoute({
  userId,
  routeId,
}: {
  userId: string | Types.ObjectId;
  routeId: string | Types.ObjectId;
}): Promise<boolean> {
  const customerTicket = (await TicketModel.find({ userId })) as ITicket[];
  const tourList = (await TourModel.find({ touristRoute: routeId })) as ITour[];

  return customerTicket.some((ticket) =>
    tourList.some((tour) => ticket._id == tour._id),
  );
}

async function findAllTicketOfUser(
  userId: string | Types.ObjectId,
): Promise<any> {
  const tickets = await TicketModel.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'tourId',
      populate: {
        path: 'touristRoute',
      },
    });

  const ticketsWithRating = await Promise.all(
    tickets.map(async (ticket: ITicket) => {
      const rating = (await RateModel.findOne({
        userId,
        touristsRouteId: (ticket.tourId as ITour).touristRoute,
      })) as IRate;

      const overallRating = await RateRepo.getOverallRatingOfRoute(
        (ticket.tourId as ITour).touristRoute,
      );

      const ratingComment = await RateRepo.getDetailRatingOfRoute(
        (ticket.tourId as ITour).touristRoute,
      );

      return {
        ...JSON.parse(JSON.stringify(ticket)),
        userRating: rating
          ? {
              rate: rating.star,
              comment: rating.description,
            }
          : null,
        totalRating: overallRating,
        ratingComment,
      };
    }),
  );

  return ticketsWithRating;
}

async function deleteTicket(ticketId: string | Types.ObjectId) {
  await TicketModel.deleteOne({ _id: ticketId });
  return ticketId;
}

export default {
  create,
  update,
  haveCustomerVisitRoute,
  findAllTicketOfUser,
  deleteTicket,
};
