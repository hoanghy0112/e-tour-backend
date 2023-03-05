import { Types } from 'mongoose';
import User, { UserInterface } from '../../model/User/User';
import Keystore from '../../model/Keystore';
import KeystoreRepo from '../KeystoreRepo';

export async function findById(
  id: Types.ObjectId,
): Promise<UserInterface | null> {
  return await User.findById(id).select('email password').lean().exec();
}

export async function findByEmail(
  email: string,
): Promise<UserInterface | null> {
  return await User.findOne({ email }).select('email password').lean().exec();
}

export async function create(
  user: UserInterface,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<{ user: UserInterface; keystore: Keystore }> {
  const createdUser = await User.create(user);
  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey,
  );

  return {
    user: { ...createdUser.toObject() },
    keystore: keystore,
  };
}

export default {
  findById,
  findByEmail,
  create,
};
