import { Types } from 'mongoose';
import UserModel, { User } from '../../model/User/User';
import Keystore from '../../model/Keystore';
import KeystoreRepo from '../KeystoreRepo';

export async function findById(id: Types.ObjectId): Promise<User | null> {
  return await UserModel.findById(id).select('email password').lean().exec();
}

export async function findByEmail(email: string): Promise<User | null> {
  return await UserModel.findOne({ email })
    .select('email password')
    .lean()
    .exec();
}

// export async function create(
//   user: User,
//   accessTokenKey: string,
//   refreshTokenKey: string,
// ): Promise<{ user: User; keystore: Keystore }> {
//   // const createdUser = await UserModel.create(user);
//   // const keystore = await KeystoreRepo.create(
//   //   createdUser,
//   //   accessTokenKey,
//   //   refreshTokenKey,
//   // );

//   // return {
//   //   user: { ...createdUser.toObject() },
//   //   keystore: keystore,
//   // };
//   return {};
// }

export default {
  findById,
  findByEmail,
  // create,
};
