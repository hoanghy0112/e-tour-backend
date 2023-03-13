import supertest from 'supertest';
import app from '../../../src/app';

describe('Authorization middleware', () => {
  const endpoint = '/demo/authorization';
  const request = supertest(app);

  it('Should response 400 if Authorization header is not passed', async () => {
    //
  });
});
