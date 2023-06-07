import { Types } from 'mongoose';
import UserModel, { ICard, IUser } from '../../model/User/User';
import { BadRequestError } from '../../../core/ApiError';
import Logger from '../../../core/Logger';

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
  cardId: string | Types.ObjectId,
  cardInfo: ICard,
): Promise<any> {
  try {
    const user = (await UserModel.findOneAndUpdate(
      { _id: userId, 'cards._id': cardId },
      {
        $set: {
          'cards.$.cardNumber': cardInfo.cardNumber,
          'cards.$.cvv': cardInfo.cvv,
          'cards.$.expiredDate': cardInfo.expiredDate,
          'cards.$.name': cardInfo.name,
          'cards.$.type': cardInfo.type,
        },
      },
      {
        new: true,
      },
    )) as IUser;

    const cards = user?.cards || [];
    return cards.find((card) => card._id.toString() === cardId);
  } catch (error) {
    throw new BadRequestError('card not found');
  }
}

async function changeDefaultCard(
  userId: string | Types.ObjectId,
  cardId: string | Types.ObjectId,
): Promise<any> {
  try {
    const user = (await UserModel.findOneAndUpdate(
      { _id: userId, 'cards._id': cardId },
      {
        defaultCard: cardId,
      },
      {
        new: true,
      },
    )) as IUser;

    const cards = user?.cards || [];
    return cards.find((card) => card._id.toString() === cardId);
  } catch (error) {
    throw new BadRequestError('card not found');
  }
}

async function findAll(userId: string | Types.ObjectId): Promise<any> {
  const user = (await UserModel.findById(userId)) as IUser;

  return user?.cards || [];
}

async function findById(
  userId: string | Types.ObjectId,
  cardId: string,
): Promise<any> {
  const user = (await UserModel.findById(userId, 'cards')) as IUser;
  const cards = user?.cards || [];
  return cards.find((card) => card._id.toString() === cardId);
}

async function findDefaultCard(userId: string | Types.ObjectId): Promise<any> {
  const user = (await UserModel.findById(userId, 'cards defaultCard')) as IUser;
  const cards = user?.cards || [];
  const defaultCardId = user?.defaultCard.toString();

  if (defaultCardId)
    return cards.find((card) => card._id.toString() === defaultCardId);
  return null;
}

async function deleteCard(
  userId: string | Types.ObjectId,
  cardId: string | Types.ObjectId,
): Promise<any> {
  const user = (await UserModel.findByIdAndUpdate(
    userId,
    {
      $pull: {
        cards: { _id: cardId },
      },
    },
    { new: true },
  )) as IUser;
  const cards = user?.cards || [];

  return cards;
}

export default {
  create,
  modify,
  changeDefaultCard,
  findAll,
  findById,
  findDefaultCard,
  deleteCard,
};
