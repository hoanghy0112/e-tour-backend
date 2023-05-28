import { Types } from 'mongoose';
import UserModel, { ICard, IUser } from '../../model/User/User';

async function create(
  userId: string | Types.ObjectId,
  cardInfo: ICard,
): Promise<any> {
  const user = (await UserModel.findOneAndUpdate(
    { _id: userId, 'cards.cardNumber': { $ne: cardInfo.cardNumber } },
    {
      $push: {
        cards: cardInfo,
      },
    },
    {
      new: true,
    },
  )) as IUser;

  return user?.cards ? user.cards.at(-1) : null;
}

async function modify(
  userId: string | Types.ObjectId,
  cardInfo: ICard,
): Promise<any> {
  const user = (await UserModel.findOneAndUpdate(
    { _id: userId, 'cards.cardNumber': cardInfo.cardNumber },
    {
      cards: cardInfo,
    },
    {
      new: true,
    },
  )) as IUser;

  return user?.cards ? user.cards.at(-1) : null;
}

// async function findAll(
//   userId: string | Types.ObjectId,
//   cardInfo: ICard,
// ): Promise<any> {
//   const user = (await UserModel.findOneAndUpdate(
//     { _id: userId, 'cards.cardNumber': cardInfo.cardNumber },
//     {
//       cards: cardInfo,
//     },
//     {
//       new: true,
//     },
//   )) as IUser;

//   return user?.cards ? user.cards.at(-1) : null;
// }

export default {
  create,
  modify,
};
