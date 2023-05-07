import bcrypt from 'bcrypt';
import {
  AuthenticationType,
  Credential,
  CredentialModel,
  UserType,
} from '../../../../../src/database/model/Credential';
import CredentialRepo from '../../../../../src/database/repository/CredentialRepo';
import KeystoreRepo from '../../../../../src/database/repository/KeystoreRepo';
import UserRepo from '../../../../../src/database/repository/User/UserRepo';
import UserModel, { IUser } from '../../../../../src/database/model/User/User';
import { KeystoreModel } from '../../../../../src/database/model/Keystore';
import supertest from 'supertest';
import app from '../../../../../src/app';
import { addHeaders } from './mock';
import JWT from '../../../../../src/core/JWT';
import { connectMongo, connection } from '../../../../../src/database';

describe('User login by username and password', () => {
  const USERNAME = 'username';
  const PASSWORD = '123456';
  const endpoint = '/user/login/basic';

  const request = supertest(app);

  let credentialId = '';

  beforeAll(async () => {
    await connectMongo();
    await UserModel.deleteMany({});
    await CredentialModel.deleteMany({});
    await KeystoreModel.deleteMany({});

    const credential = {
      authenticationType: AuthenticationType.PASSWORD,
      userType: UserType.CLIENT,
      username: USERNAME,
      password: PASSWORD,
    } as Credential;

    const createdCredential = await CredentialRepo.create(credential);
    credentialId = createdCredential._id.toString();

    const tokens = await KeystoreRepo.create(createdCredential);

    const createdUser = await UserRepo.create({
      fullName: 'hyhy',
      identity: '12345',
      isForeigner: false,
      email: 'hy@gmail.com',
      image: 'https://image.hub.com/image',
      address: '3/32 Quang Trung',
      phoneNumber: '0916769792',
      credential: createdCredential,
    } as IUser);
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await CredentialModel.deleteMany({});
    await KeystoreModel.deleteMany({});
    connection.close();
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

  it('Should send success response and correct credential', async () => {
    const response = await addHeaders(
      request.post(endpoint).send({
        username: USERNAME,
        password: PASSWORD,
      }),
    );

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe('10000');

    const accessToken = response.body.data.tokens.accessToken;
    const JWT_Token = await JWT.validate(accessToken);

    expect(JWT_Token.sub).toBe(credentialId);
  });
});
