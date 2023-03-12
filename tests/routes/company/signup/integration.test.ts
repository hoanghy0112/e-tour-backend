import supertest from 'supertest';
import app from '../../../../src/app';

describe('Company sign up', () => {
  const endpoint = '/company/signup';
  const request = supertest(app);

  test('Should send 400 when name is not provided', async () => {
    //
  });
});
