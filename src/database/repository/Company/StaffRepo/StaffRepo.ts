import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Staff, StaffModel } from '../../../model/Company/Staff';
import {
  AuthenticationType,
  Credential,
  CredentialModel,
  UserType,
} from '../../../model/Credential';
import { createParameter, findByUsernameParameter } from './StaffRepoSchema';
import KeystoreRepo from '../../KeystoreRepo';

async function create({
  staff,
  username,
  password,
}: createParameter): Promise<Staff> {
  // const accessTokenKey = crypto.randomBytes(64).toString('hex');
  // const refreshTokenKey = crypto.randomBytes(64).toString('hex');

  const passwordHash = await bcrypt.hash(password, 10);

  const credential = {
    authenticationType: AuthenticationType.PASSWORD,
    userType: UserType.STAFF,
    username,
    password: passwordHash,
  } as Credential;

  const createdCredential = await CredentialModel.create(credential);

  const createdStaff = await StaffModel.create({
    ...staff,
    credentialId: createdCredential._id,
  } as Staff);

  return createdStaff;
}

async function findByUsername({
  username,
}: findByUsernameParameter): Promise<Staff | null> {
  // return await StaffModel.findOne({ username }).lean().exec();
  return null;
}

export default {
  create,
  findByUsername,
};
