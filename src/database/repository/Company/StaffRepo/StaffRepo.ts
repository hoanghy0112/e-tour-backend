import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Staff, StaffModel } from '@model/Company/Staff';
import { AuthenticationType, Credential, UserType } from '@model/Credential';
import { createParameter, findByUsernameParameter } from './StaffRepoSchema';
import CredentialRepo from '../../CredentialRepo';

async function create({
  staff,
  username,
  password,
}: createParameter): Promise<Staff> {
  const passwordHash = await bcrypt.hash(password, 10);

  const credential = {
    authenticationType: AuthenticationType.PASSWORD,
    userType: UserType.STAFF,
    username,
    password: passwordHash,
  } as Credential;

  const createdCredential = await CredentialRepo.create(credential);

  const createdStaff = (
    await StaffModel.create({
      ...staff,
      credential: createdCredential._id,
    })
  ).populate('credential');

  return createdStaff;
}

async function findByUsername({
  username,
}: findByUsernameParameter): Promise<Staff | null> {
  return await StaffModel.findOne({ username })
    .populate('credential')
    .lean()
    .exec();
}

export default {
  create,
  findByUsername,
};
