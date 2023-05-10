import UserModel, { IUser } from '@model/User/User';
import TicketModel, { ITicket } from '../../model/User/Ticket';
import { InternalError } from '../../../core/ApiError';
import VoucherRepo from './VoucherRepo';
import TourModel, { ITour } from '../../model/Company/Tour';
import { Types } from 'mongoose';
import TourRouteRepo from '../Company/TourRoute/TourRouteRepo';
import TouristsRouteModel from '../../model/Company/TouristsRoute';
import { touristRoutePoint } from '../../../constants/touristRoutePoint';

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

  voucherValues.forEach((value) => (finalPrice = finalPrice * value));

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
): Promise<ITicket[]> {
  const tickets = await TicketModel.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'tourId',
      populate: {
        path: 'touristRoute',
      },
    });
  return tickets;
}

export default {
  create,
  haveCustomerVisitRoute,
  findAllTicketOfUser,
};
