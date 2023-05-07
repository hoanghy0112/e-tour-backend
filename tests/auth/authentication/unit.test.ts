import supertest from 'supertest';

import app from '../../../src/app';
import { connectMongo, connection } from '../../../src/database';
import UserModel, { IUser } from '../../../src/database/model/User/User';
import {
  Staff,
  StaffModel,
  StaffRole,
} from '../../../src/database/model/Company/Staff';
import CompanyModel from '../../../src/database/model/Company/Company';
import {
  AuthenticationType,
  Credential,
  CredentialModel,
  UserType,
} from '../../../src/database/model/Credential';
import { KeystoreModel } from '../../../src/database/model/Keystore';
import StaffRepo from '../../../src/database/repository/Company/StaffRepo/StaffRepo';
import { v4 } from 'uuid';
import KeystoreRepo from '../../../src/database/repository/KeystoreRepo';
import UserRepo from '../../../src/database/repository/User/UserRepo';
import CredentialRepo from '../../../src/database/repository/CredentialRepo';

describe('User authentication middleware', () => {
  const endpoint = '/demo/authentication/user';
  const request = supertest(app);

  beforeAll(async () => {
    await connectMongo();
    await UserModel.deleteMany({});
    await StaffModel.deleteMany({});
    await CompanyModel.deleteMany({});
    await CredentialModel.deleteMany({});
    await KeystoreModel.deleteMany({});
  });

  afterAll(() => {
    connection.close();
  });

  it('Should response 400 if Authentication header is not passed', async () => {
    const response = await request.get(endpoint);

    expect(response.status).toBe(400);
  });

  it('Should response 200 if access token is valid', async () => {
    const USERNAME = v4();
    const PASSWORD = v4();

    const credential = await CredentialRepo.create({
      username: USERNAME,
      password: PASSWORD,
      authenticationType: AuthenticationType.PASSWORD,
      userType: UserType.CLIENT,
    } as Credential);

    const user = await UserRepo.create({
      fullName: v4(),
      credential: credential,
      identity: v4(),
      isForeigner: false,
      email: v4(),
    } as IUser);

    const tokens = await KeystoreRepo.create(user.credential);

    const response = await request
      .get(endpoint)
      .set('authorization', `Bearer ${tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.user._id).toBe(user._id?.toString() || '');
  }, 15000);
});

describe('Staff authentication middleware', () => {
  const endpoint = '/demo/authentication/staff';
  const request = supertest(app);

  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(() => {
    connection.close();
  });

  it('Should response 400 if Authorization header is not passed', async () => {
    //
  });

  it('Should response 200 if access token is valid', async () => {
    await UserModel.deleteMany({});
    await StaffModel.deleteMany({});
    await CompanyModel.deleteMany({});
    await CredentialModel.deleteMany({});
    await KeystoreModel.deleteMany({});

    const USERNAME = v4();
    const PASSWORD = v4();

    const staff = await StaffRepo.create({
      staff: {
        fullName: 'HY',
        role: StaffRole.STAFF,
      } as Staff,
      username: USERNAME,
      password: PASSWORD,
    });

    const tokens = await KeystoreRepo.create(staff.credential);

    const response = await request
      .get(endpoint)
      .set('authorization', `Bearer ${tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.staff._id).toBe(staff._id.toString());
    expect(response.body.data.accessToken).toBe(tokens.accessToken);
  });
});
