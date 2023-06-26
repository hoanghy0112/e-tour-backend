import axios from 'axios';
import { NotificationType } from '../model/Company/Company';
import UserModel, { INotification, IUser } from '../model/User/User';
import { Types } from 'mongoose';
import TicketModel from '../model/User/Ticket';
import TourRouteRepo from './Company/TourRoute/TourRouteRepo';
import TouristsRouteModel from '../model/Company/TouristsRoute';
import TourModel from '../model/Company/Tour';

async function create(
  user: string | Types.ObjectId | IUser,
  notificationType: NotificationType,
  notification: INotification,
) {
  if (
    notificationType == NotificationType.ALL ||
    (notificationType == NotificationType.ONLY_SPECIAL &&
      Math.floor(Math.random() * 2) == 0)
  ) {
    await axios.post('https://app.nativenotify.com/api/notification', {
      appId: 8278,
      appToken: 'xhQlEeujCXadakfyUIlyRf',
      title: notification.title,
      body: notification.content,
      dateSent: new Date(),
      pushData: notification,
      bigPictureURL: notification.image,
    });
    await UserModel.findByIdAndUpdate(user, {
      $push: {
        notifications: notification,
      },
    });
    return true;
  }
  return false;
}

async function sendToTourCustomer(
  tourId: string | Types.ObjectId,
  type: NotificationType,
  notification: INotification,
) {
  const tour = await TourModel.findById(tourId);
  const tickets = await TicketModel.find({ tourId });
  const customers = tickets.map((ticket) => ticket.userId) as string[];

  const notificationData = {
    ...notification,
    link: `tour-${tour?.touristRoute.toString()}/new`,
    createdAt: new Date(),
  };

  const notificationStates = await Promise.all(
    // customers.map((userId) => create(userId, type, notificationData)),
    tickets.map((ticket) =>
      create(ticket.userId, type, {
        ...notification,
        link: `ticket-${ticket._id.toString()}/notification`,
        createdAt: new Date(),
      }),
    ),
  );

  await TourModel.findByIdAndUpdate(tourId, {
    $push: {
      notifications: notificationData,
    },
  });

  return customers.filter((_, i) => notificationStates[i] == true);
}

async function getTourNotification(tourId: string) {
  const tour = await TourModel.findById(tourId).populate('notifications');
  return (tour?.notifications || []).reverse();
}

export default {
  create,
  sendToTourCustomer,
  getTourNotification,
};
