import supertest from 'supertest';
import app from '../../../../src/app';
import {
  Staff,
  StaffModel,
  StaffRole,
} from '../../../../src/database/model/Company/Staff';
import { CredentialModel } from '../../../../src/database/model/Credential';
import { KeystoreModel } from '../../../../src/database/model/Keystore';
import UserModel from '../../../../src/database/model/User/User';
import StaffRepo from '../../../../src/database/repository/Company/StaffRepo/StaffRepo';
import { PASSWORD, USERNAME } from './mock';
import { connection } from '../../../../src/database';

describe('Staff login', () => {
  const endpoint = '/company/login/basic';
  const request = supertest(app);

  beforeEach(async () => {
    await UserModel.deleteMany({});
    await StaffModel.deleteMany({});
    await CredentialModel.deleteMany({});
    await KeystoreModel.deleteMany({});

    await StaffRepo.create({
      staff: {
        fullName: 'HY',
        role: StaffRole.STAFF,
      } as Staff,
      username: USERNAME,
      password: PASSWORD,
    });
  });

  afterAll(async () => {
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

  test('Should send success response when credential is valid', async () => {
    const response = await request.post(endpoint).send({
      username: USERNAME,
      password: PASSWORD,
    });

    expect(response.status).toBe(200);
  });
});
