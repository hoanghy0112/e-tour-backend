import supertest from 'supertest';
import app from '../../../../src/app';

describe('Get image', () => {
  const endpoint = '/images';
  const request = supertest(app);

  it('Should response 400 if image not found', async () => {
    const response = await request.get(`${endpoint}/not-exist-image.png`);

    expect(response.status).toBe(400);
  });

  it('Should successfully response image', async () => {
    const response = await request.get(`${endpoint}/image.jpg`);

    expect(response.status).toBe(200);
    expect(response.type).toBe('image/jpeg');
  });
});
