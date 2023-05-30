import axios from 'axios';
import { NotificationType } from '../model/Company/Company';
import UserModel, { INotification, IUser } from '../model/User/User';

async function create(
  user: IUser,
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
  }
}

export default {
  create,
};
