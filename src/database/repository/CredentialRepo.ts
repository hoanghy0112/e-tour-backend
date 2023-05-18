import { Credential, CredentialModel } from '../model/Credential';
import bcrypt from 'bcrypt';

async function create({
  username,
  password,
  accessToken,
  authenticationType,
  userType,
  uid,
}: Credential): Promise<Credential> {
  const passwordHash = await bcrypt.hash(password || '', 10);
  const credential = await CredentialModel.create({
    username,
    password: passwordHash,
    accessToken,
    authenticationType,
    userType,
    uid,
  });

  return credential;
}

export default {
  create,
};
