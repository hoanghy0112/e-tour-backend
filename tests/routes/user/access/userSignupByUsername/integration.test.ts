import supertest from 'supertest';
import { connectMongo, connection } from '../../../../../src/database';
import {
  AuthenticationType,
  Credential,
  CredentialModel,
  UserType,
} from '../../../../../src/database/model/Credential';
import UserModel, { IUser } from '../../../../../src/database/model/User/User';
import app from '../../../../../src/app';
import path from 'path';
import {
  address,
  email,
  fullName,
  identityExpiredAt,
  image,
  identity,
  isEmailVerified,
  isForeigner,
  isPhoneVerified,
  password,
  phoneNumber,
  username,
} from './mock';
import { readFileSync } from 'fs';
import UserRepo from '../../../../../src/database/repository/User/UserRepo';
import CredentialRepo from '../../../../../src/database/repository/CredentialRepo';
import { deleteImageFromS3, getS3Image } from '../../../../../src/database/s3';

describe('User sign up', () => {
  const endpoint = '/user/signup/basic';
  const request = supertest(app);

  const imageFile = path.resolve(__dirname, './avatar.png');

  async function resetDatabase() {
    await UserModel.deleteMany({});
    await CredentialModel.deleteMany({});
  }

  beforeEach(async () => {
    await connectMongo();
    await resetDatabase();
  });

  afterAll(async () => {
    jest.unmock('../../../../../src/database/s3');
    connection.close();
  });

  it('Should send 400 Bad Request when username is not valid', async () => {
    const credential = {
      authenticationType: AuthenticationType.PASSWORD,
      userType: UserType.CLIENT,
      username: username,
      password: password,
    } as Credential;

    const createdCredential = await CredentialRepo.create(credential);

    const createdUser = await UserRepo.create({
      fullName: fullName,
      identity: identity,
      isForeigner: true,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
      identityExpiredAt: identityExpiredAt,
      credential: createdCredential,
    } as IUser);

    const response = await request
      .post(endpoint)
      .field('username', username)
      .field('password', password)
      .field('fullName', fullName)
      .field('identity', identity)
      .field('isForeigner', isForeigner)
      .field('email', email)
      .field('address', address)
      .field('phoneNumber', phoneNumber)
      .field('identityExpiredAt', identityExpiredAt.toISOString())
      .field('isPhoneVerified', isPhoneVerified)
      .field('isEmailVerified', isEmailVerified)
      .attach('image', imageFile);

    expect(response.status).toBe(400);
    expect(await UserModel.count()).toBe(1);
    await resetDatabase();
  }, 10000);

  it('Should send 400 when user is foreigner but identityExpiredAt is empty', async () => {
    const response = await request
      .post(endpoint)
      .field('username', username)
      .field('password', password)
      .field('fullName', fullName)
      .field('identity', identity)
      .field('isForeigner', true)
      .field('email', email)
      .field('address', address)
      .field('phoneNumber', phoneNumber)
      .field('isPhoneVerified', isPhoneVerified)
      .field('isEmailVerified', isEmailVerified)
      .attach('image', imageFile);

    expect(response.status).toBe(400);
    expect(await UserModel.count()).toBe(0);
  });

  it('Should send 400 when user is not foreigner but phoneNumber or address is empty', async () => {
    const response = await request
      .post(endpoint)
      .field('username', username)
      .field('password', password)
      .field('fullName', fullName)
      .field('identity', identity)
      .field('isForeigner', false)
      .field('email', email)
      .field('identityExpiredAt', identityExpiredAt.toISOString())
      .field('isPhoneVerified', isPhoneVerified)
      .field('isEmailVerified', isEmailVerified)
      .attach('image', imageFile);

    expect(response.status).toBe(400);
    expect(await UserModel.count()).toBe(0);
  });

  it('Should send 200 when user info is valid and image is empty', async () => {
    const response = await request
      .post(endpoint)
      .field('username', username)
      .field('password', password)
      .field('fullName', fullName)
      .field('identity', identity)
      .field('isForeigner', true)
      .field('email', email)
      .field('identityExpiredAt', identityExpiredAt.toISOString())
      .field('isPhoneVerified', isPhoneVerified)
      .field('isEmailVerified', isEmailVerified);

    expect(response.status).toBe(200);
    expect(await UserModel.count()).toBe(1);
  });

  it.skip('Should send 200 when user is foreigner and user info is valid', async () => {
    const response = await request
      .post(endpoint)
      .field('username', username)
      .field('password', password)
      .field('fullName', fullName)
      .field('identity', identity)
      .field('isForeigner', true)
      .field('email', email)
      .field('identityExpiredAt', identityExpiredAt.toISOString())
      .field('isPhoneVerified', isPhoneVerified)
      .field('isEmailVerified', isEmailVerified)
      .attach('image', imageFile);

    const imageID = response.body.data.user.image;
    const avatarImage = await getS3Image(imageID);

    await deleteImageFromS3(imageID);

    expect(response.status).toBe(200);
    expect(await UserModel.count()).toBe(1);
    expect(avatarImage).not.toBeNull();
  }, 10000);

  it('Should send 200 when user is not foreigner and user info is valid', async () => {
    const response = await request
      .post(endpoint)
      .field('username', username)
      .field('password', password)
      .field('fullName', fullName)
      .field('identity', identity)
      .field('isForeigner', false)
      .field('email', email)
      .field('address', address)
      .field('phoneNumber', phoneNumber)
      .field('isPhoneVerified', isPhoneVerified)
      .field('isEmailVerified', isEmailVerified)
      .attach('image', imageFile);

    const imageID = response.body.data.user.image;
    const avatarImage = await getS3Image(imageID);

    await deleteImageFromS3(imageID);

    expect(response.status).toBe(200);
    expect(await UserModel.count()).toBe(1);
    expect(avatarImage).not.toBeNull();
  });
});
