import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Staff, StaffModel } from '@model/Company/Staff';
import {
  AuthenticationType,
  Credential,
  CredentialModel,
  UserType,
} from '@model/Credential';
import { createParameter, findByUsernameParameter } from './StaffRepoSchema';
import CredentialRepo from '../../CredentialRepo';
import KeystoreRepo from '../../KeystoreRepo';
import Logger from '../../../../core/Logger';
import { Types } from 'mongoose';

async function create({
  staff,
  username,
  password,
}: createParameter): Promise<Staff> {
  const credential = {
    authenticationType: AuthenticationType.PASSWORD,
    userType: UserType.STAFF,
    username,
    password,
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
}: findByUsernameParameter): Promise<any> {
  const credential = await CredentialModel.findOne({ username });

  return credential;
  // if (!credential) return null;

  // return await StaffModel.findOne({ credential: credential?._id.toString() })
  //   .populate('credential')
  //   .lean()
  //   .exec();
}

async function findById(id: Types.ObjectId | string): Promise<Staff | null> {
  const staff = await StaffModel.findById(id);
  return staff;
}

async function findByCredentialId(id: string): Promise<Staff | null> {
  const credential = await CredentialModel.findById(id);

  return StaffModel.findOne({ credential: credential?._id.toString() })
    .populate('credential')
    .lean()
    .exec();
}

export default {
  create,
  findByUsername,
  findByCredentialId,
  findById,
};
