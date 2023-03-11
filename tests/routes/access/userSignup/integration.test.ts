import supertest from 'supertest';
import { connection } from '../../../../src/database';
import {
  AuthenticationType,
  CredentialModel,
  UserType,
} from '../../../../src/database/model/Credential';
import UserModel from '../../../../src/database/model/User/User';
import app from '../../../../src/app';
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

describe('User sign up', () => {
  const endpoint = '/user/signup';
  const request = supertest(app);

  async function resetDatabase() {
    await UserModel.deleteMany({});
    await CredentialModel.deleteMany({});
  }

  beforeAll(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    // resetDatabase();
    connection.close();
  });

  it('Should send 400 Bad Request when username is not valid', async () => {
    await CredentialModel.create({
      authenticationType: AuthenticationType.PASSWORD,
      userType: UserType.CLIENT,
      username: username,
      password: password,
    });

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
      .attach('image', path.resolve(__dirname, 'avatar.png'));

    expect(response.status).toBe(400);
    expect(await UserModel.count()).toBe(1);
  });

  // it('Should send 400 when user is foreigner but identityExpiredAt is empty', async () => {
  //   const response = await request
  //     .post(endpoint)
  //     .send({
  //       username: username,
  //       password: password,
  //       fullName: fullName,
  //       identity: identity,
  //       isForeigner: true,
  //       email: email,
  //       address: address,
  //       phoneNumber: phoneNumber,
  //       isPhoneVerified: isPhoneVerified,
  //       isEmailVerified: isEmailVerified,
  //     })
  //     .attach('image', path.resolve(__dirname, './avatar.png'));

  //   expect(response.status).toBe(400);
  //   expect(await UserModel.count()).toBe(0);
  // });

  // it('Should send 400 when user is not foreigner but phoneNumber or address is empty', async () => {
  //   const response = await request
  //     .post(endpoint)
  //     .send({
  //       username: username,
  //       password: password,
  //       fullName: fullName,
  //       identity: identity,
  //       isForeigner: false,
  //       email: email,
  //       isPhoneVerified: isPhoneVerified,
  //       isEmailVerified: isEmailVerified,
  //     })
  //     .attach('image', path.resolve(__dirname, './avatar.png'));

  //   expect(response.status).toBe(400);
  //   expect(await UserModel.count()).toBe(0);
  // });

  // it('Should send 200 when user is foreigner and user info is valid', async () => {
  //   const response = await request
  //     .post(endpoint)
  //     .send({
  //       username: username,
  //       password: password,
  //       fullName: fullName,
  //       identity: identity,
  //       isForeigner: true,
  //       email: email,
  //       address: address,
  //       phoneNumber: phoneNumber,
  //       isPhoneVerified: isPhoneVerified,
  //       isEmailVerified: isEmailVerified,
  //     })
  //     .attach('image', path.resolve(__dirname, './avatar.png'));

  //   expect(response.status).toBe(200);
  //   expect(await UserModel.count()).toBe(1);

  //   await resetDatabase();
  // });

  // it('Should send 200 when user is not foreigner and user info is valid', async () => {
  //   const response = await request
  //     .post(endpoint)
  //     .send({
  //       username: username,
  //       password: password,
  //       fullName: fullName,
  //       identity: identity,
  //       isForeigner: false,
  //       email: email,
  //       address: address,
  //       phoneNumber: phoneNumber,
  //       isPhoneVerified: isPhoneVerified,
  //       isEmailVerified: isEmailVerified,
  //     })
  //     .attach('image', path.resolve(__dirname, './avatar.png'));

  //   expect(response.status).toBe(200);
  //   expect(await UserModel.count()).toBe(1);

  //   await resetDatabase();
  // });
});
