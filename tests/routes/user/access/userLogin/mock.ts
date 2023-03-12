import * as authUtils from '../../../../../src/auth/authUtils';

export const getAccessTokenSpy = jest.spyOn(authUtils, 'getAccessToken');

export const addHeaders = (request: any) =>
  request.set('Content-Type', 'application/json').timeout(2000);
