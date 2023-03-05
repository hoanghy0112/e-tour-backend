import Keystore, { KeystoreModel } from '../model/Keystore';
import { Types } from 'mongoose';
import { UserInterface } from '../model/User/User';

async function findforKey(
  client: UserInterface,
  key: string,
): Promise<Keystore | null> {
  return KeystoreModel.findOne({
    client: client,
    primaryKey: key,
    status: true,
  })
    .lean()
    .exec();
}

async function remove(id: Types.ObjectId): Promise<Keystore | null> {
  return KeystoreModel.findByIdAndRemove(id).lean().exec();
}

async function removeAllForClient(client: UserInterface) {
  return KeystoreModel.deleteMany({ client: client }).exec();
}

async function find(
  client: UserInterface,
  primaryKey: string,
  secondaryKey: string,
): Promise<Keystore | null> {
  return KeystoreModel.findOne({
    client: client,
    primaryKey: primaryKey,
    secondaryKey: secondaryKey,
  })
    .lean()
    .exec();
}

async function create(
  client: UserInterface,
  primaryKey: string,
  secondaryKey: string,
): Promise<Keystore> {
  const now = new Date();
  const keystore = await KeystoreModel.create({
    client: client,
    primaryKey: primaryKey,
    secondaryKey: secondaryKey,
    createdAt: now,
    updatedAt: now,
  });
  return keystore.toObject();
}

export default {
  findforKey,
  remove,
  removeAllForClient,
  find,
  create,
};
