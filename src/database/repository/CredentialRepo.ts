import { Credential, CredentialModel } from '../model/Credential';
import bcrypt from 'bcrypt';

async function create({
  username,
  password,
  authenticationType,
  userType,
}: Credential): Promise<Credential> {
  const passwordHash = await bcrypt.hash(password || '', 10);
  const credential = await CredentialModel.create({
    username,
    password: passwordHash,
    authenticationType,
    userType,
  });

  return credential;
}

export default {
  create,
};
