import { Types } from 'mongoose';
import UserModel, { ICard } from '../../model/User/User';

async function create(
  userId: string | Types.ObjectId,
  cardInfo: ICard,
): Promise<ICard> {
  const card = (await UserModel.findOneAndUpdate(
    { _id: userId, 'cards.cardNumber': cardInfo.cardNumber },
    {
      $push: { cards: cardInfo },
    },
    {
      upsert: true,
      new: true,
    },
  )) as ICard;

  return card;
}

export default {
  create,
};
