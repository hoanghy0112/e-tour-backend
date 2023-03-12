import { Credential, CredentialModel } from '../model/Credential';

async function create({
  username,
  password,
  authenticationType,
  userType,
}: Credential): Promise<Credential> {
  const credential = await CredentialModel.create({
    username,
    password,
    authenticationType,
    userType,
  });

  return credential;
}

export default {
  create,
};
