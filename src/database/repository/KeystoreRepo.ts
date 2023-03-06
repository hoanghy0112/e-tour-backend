import Keystore, { KeystoreModel } from '../model/Keystore';
import { Types } from 'mongoose';
import { User } from '../model/User/User';
import { Credential, CredentialModel } from '../model/Credential';

async function findforKey(key: string): Promise<Keystore | null> {
  return KeystoreModel.findOne({
    primaryKey: key,
    status: true,
  })
    .lean()
    .exec();
}

// async function remove(id: Types.ObjectId): Promise<Keystore | null> {
//   return KeystoreModel.findByIdAndRemove(id).lean().exec();
// }

// async function removeAllForClient(client: User) {
//   return KeystoreModel.deleteMany({ client: client }).exec();
// }

async function find(
  client: Credential,
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
  client: Credential,
  primaryKey: string,
  secondaryKey: string,
): Promise<Keystore> {
  const keystore = await KeystoreModel.create({
    client: client,
    primaryKey: primaryKey,
    secondaryKey: secondaryKey,
  });
  return keystore.toObject();
}

export default {
  findforKey,
  // remove,
  // removeAllForClient,
  find,
  create,
};
