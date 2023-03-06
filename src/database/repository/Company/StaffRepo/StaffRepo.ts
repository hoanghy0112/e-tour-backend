import bcrypt from 'bcrypt';
import { Staff, StaffModel } from '../../../model/Company/Staff';
import {
  AuthenticationType,
  Credential,
  CredentialModel,
  UserType,
} from '../../../model/Credential';
import { createParameter } from './StaffRepoSchema';

async function create({
  staff,
  username,
  password,
}: createParameter): Promise<Staff | null> {
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

const StaffRepo = {
  create,
};

export default StaffRepo;
