import supertest from 'supertest';
import app from '../../../src/app';
import UserModel from '../../../src/database/model/User/User';
import {
  Permission,
  Staff,
  StaffModel,
  StaffRole,
} from '../../../src/database/model/Company/Staff';
import CompanyModel from '../../../src/database/model/Company/Company';
import { CredentialModel } from '../../../src/database/model/Credential';
import { KeystoreModel } from '../../../src/database/model/Keystore';
import { v4 } from 'uuid';
import StaffRepo from '../../../src/database/repository/Company/StaffRepo/StaffRepo';
import KeystoreRepo from '../../../src/database/repository/KeystoreRepo';

describe('Authorization middleware', () => {
  const endpoint = '/demo/authorization';
  const request = supertest(app);

  beforeAll(async () => {
    await UserModel.deleteMany({});
    await StaffModel.deleteMany({});
    await CompanyModel.deleteMany({});
    await CredentialModel.deleteMany({});
    await KeystoreModel.deleteMany({});
  });

  it('Should response 400 if Authorization header is not passed', async () => {
    const response = await request.get(endpoint);

    expect(response.status).toBe(400);
  });

  it('Should response 200 if access token is valid and staff has enough permission', async () => {
    const USERNAME = v4();
    const PASSWORD = v4();

    const staff = await StaffRepo.create({
      staff: {
        fullName: 'HY',
        role: StaffRole.STAFF,
        permissions: [Permission.EDIT_ROUTE, Permission.EDIT_TOUR],
      } as Staff,
      username: USERNAME,
      password: PASSWORD,
    });

    const tokens = await KeystoreRepo.create(staff.credential);

    const response = await request
      .get(endpoint)
      .set('authorization', `Bearer ${tokens.accessToken}`);

    expect(response.status).toBe(200);
  }, 15000);

  it('Should response 401 if staff does not have enough permission', async () => {
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
        permissions: [Permission.EDIT_ROUTE],
      } as Staff,
      username: USERNAME,
      password: PASSWORD,
    });

    const tokens = await KeystoreRepo.create(staff.credential);

    const response = await request
      .get(endpoint)
      .set('authorization', `Bearer ${tokens.accessToken}`);

    expect(response.status).toBe(401);
  }, 15000);
});
