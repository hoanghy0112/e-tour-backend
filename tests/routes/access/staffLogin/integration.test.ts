import bcrypt from 'bcrypt';
import supertest from 'supertest';
import app from '../../../../src/app';
import {
  AuthenticationType,
  Credential,
  CredentialModel,
  UserType,
} from '../../../../src/database/model/Credential';
import { KeystoreModel } from '../../../../src/database/model/Keystore';
import UserModel, { User } from '../../../../src/database/model/User/User';
import CredentialRepo from '../../../../src/database/repository/CredentialRepo';
import KeystoreRepo from '../../../../src/database/repository/KeystoreRepo';
import UserRepo from '../../../../src/database/repository/User/UserRepo';
import { PASSWORD, USERNAME } from './mock';

describe('Staff login', () => {
  const endpoint = '/company/login/basic';
  const request = supertest(app);

  beforeAll(async () => {
    await UserModel.deleteMany({});
    await CredentialModel.deleteMany({});
    await KeystoreModel.deleteMany({});

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    const credential = {
      authenticationType: AuthenticationType.PASSWORD,
      userType: UserType.CLIENT,
      username: USERNAME,
      password: passwordHash,
    } as Credential;

    const createdCredential = await CredentialRepo.create(credential);

    await UserRepo.create({
      fullName: 'hyhy',
      identity: '12345',
      isForeigner: false,
      email: 'hy@gmail.com',
      image: 'https://image.hub.com/image',
      address: '3/32 Quang Trung',
      phoneNumber: '0916769792',
      credential: createdCredential,
    } as User);
  });

  test('Should send error response when username is invalid', async () => {
    const response = await request.post(endpoint).send({
      username: 'wrong-username',
      password: PASSWORD,
    });

    expect(response.status).toBe(401);
  });

  test('Should send error response when password is wrong', async () => {
    const response = await request.post(endpoint).send({
      username: USERNAME,
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
  });

  test('Should send success response when credential is valid', async () => {
    const response = await request.post(endpoint).send({
      username: USERNAME,
      password: PASSWORD,
    });

    expect(response.status).toBe(200);
  });
});
