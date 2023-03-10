import supertest from 'supertest';

import app from '../../../src/app';
import { addHeaders, getAccessTokenSpy } from './mock';

describe('user authentication validation', () => {
  const endpoint = '/user/profile';
  const request = supertest(app);

  it('Should response 400 if Authorization header is not passed', async () => {
    const response = await addHeaders(request.get(endpoint));
    expect(response.status).toBe(400);
    expect(getAccessTokenSpy).not.toBeCalled();
  });
});
