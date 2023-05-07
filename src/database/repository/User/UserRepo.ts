import { Types } from 'mongoose';
import UserModel, { IUser } from '@model/User/User';
import Keystore from '@model/Keystore';
import KeystoreRepo from '../KeystoreRepo';
import { CredentialModel } from '../../model/Credential';
import Logger from '../../../core/Logger';

export async function findById(id: Types.ObjectId): Promise<IUser | null> {
  return await UserModel.findById(id)
    .populate('credential')
    .select('credential')
    .lean()
    .exec();
}

export async function findByCredentialId(id: string): Promise<IUser | null> {
  const credential = await CredentialModel.findById(id);

  if (!credential) return null;

  return await UserModel.findOne({ credential: credential._id.toString() })
    .populate('credential')
    .lean()
    .exec();
}

export async function findByUsername(username: string): Promise<IUser | null> {
  const credential = await CredentialModel.findOne({ username });

  if (!credential) return null;

  return await UserModel.findOne({ credential: credential._id.toString() })
    .populate('credential')
    .select('credential')
    .lean()
    .exec();
}

export async function create(user: IUser): Promise<IUser> {
  const createdUser = await UserModel.create({
    ...user,
    credential: user.credential._id,
  });

  return createdUser;
}

export default {
  findById,
  findByUsername,
  findByCredentialId,
  create,
};
