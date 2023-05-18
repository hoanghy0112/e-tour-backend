import crypto from 'crypto';
import { createTokens } from '../../auth/authUtils';
import { Tokens } from '../../types/app-request';
import Keystore, { KeystoreModel } from '@model/Keystore';
import { Types } from 'mongoose';
import { IUser } from '@model/User/User';
import { Credential, CredentialModel } from '@model/Credential';
import Logger from '../../core/Logger';

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

async function create(credential: Credential): Promise<Tokens> {
  const accessTokenKey = crypto.randomBytes(64).toString('hex');
  const refreshTokenKey = crypto.randomBytes(64).toString('hex');
  const creadentialId = credential?._id || credential;

  const keystore = await KeystoreModel.create({
    client: creadentialId.toString(),
    primaryKey: accessTokenKey,
    secondaryKey: refreshTokenKey,
  });

  const tokens = createTokens(credential, accessTokenKey, refreshTokenKey);

  return tokens;
}

export default {
  findforKey,
  find,
  create,
};
