import { IUser } from '../../../database/model/User/User';
import _ from 'lodash';

export const enum AccessMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

export async function getUserData(user: IUser) {
  const data = _.pick(user, ['_id', 'fullName', 'email']);
  return data;
}
