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
import CompanyModel from '../../../../src/database/model/Company/Company';
import StaffRepo from '../../../../src/database/repository/Company/StaffRepo/StaffRepo';
import {
  address,
  description,
  email,
  existingUsername,
  name,
  password,
  phone,
  username,
} from './mock';
import path from 'path';
import { connection } from '../../../../src/database';

describe('Company sign up', () => {
  const endpoint = '/company/signup/basic';
  const request = supertest(app);

  beforeAll(async () => {
    await UserModel.deleteMany({});
    await CompanyModel.deleteMany({});
    await StaffModel.deleteMany({});
    await CredentialModel.deleteMany({});
    await KeystoreModel.deleteMany({});

    await StaffRepo.create({
      staff: {
        fullName: 'HY',
        role: StaffRole.STAFF,
      } as Staff,
      username: existingUsername,
      password: password,
    });
  });

  afterAll(async () => {
    connection.close();
    jest.unmock('../../../../src/database/s3');
  });

  test('Should send 400 when username and password is invalid', async () => {
    const response = await request
      .post(endpoint)
      .field('name', name)
      .field('email', email)
      .field('description', description)
      .field('address', address)
      .field('phone', phone)
      .field('username', existingUsername)
      .field('password', password);

    expect(response.status).toBe(400);
  });

  test('Should send 200 when basic information is valid', async () => {
    const response = await request
      .post(endpoint)
      .field('name', name)
      .field('email', email)
      .field('description', description)
      .field('address', address)
      .field('phone', phone)
      .field('username', username)
      .field('password', password);

    expect(response.status).toBe(200);
  });

  test('Should send 200 when company has logo image', async () => {
    const response = await request
      .post(endpoint)
      .field('name', name)
      .field('email', email)
      .field('description', description)
      .field('address', address)
      .field('phone', phone)
      .field('username', username)
      .field('password', password)
      .attach('image', path.resolve(__dirname, './image.png'))
      .attach('previewImages', path.resolve(__dirname, './preview1.png'))
      .attach('previewImages', path.resolve(__dirname, './preview2.png'));

    expect(response.status).toBe(200);
    expect(response.body.data.previewImages.length).toBe(2);
  });
});
