import { UserInterface } from '../../database/model/User/User';
import _ from 'lodash';

export const enum AccessMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

export async function getUserData(user: UserInterface) {
  const data = _.pick(user, ['_id', 'name', 'roles', 'profilePicUrl']);
  return data;
}
