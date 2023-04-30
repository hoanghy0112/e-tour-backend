import supertest from 'supertest';
import app from '../../../../src/app';
import { connectMongo, connection } from '../../../../src/database';

describe('Get image', () => {
  const endpoint = '/images';
  const request = supertest(app);

  beforeAll(async () => {
    await connectMongo();
  });

  afterAll(() => {
    connection.close();
  });

  it('Should response 400 if image not found', async () => {
    const response = await request.get(`${endpoint}/not-exists-image.png`);

    expect(response.status).toBe(400);
  });

  it('Should successfully response image', async () => {
    const response = await request.get(`${endpoint}/image.jpg`);

    expect(response.status).toBe(200);
  }, 15000);
});
