import { authenticateStaff, authenticateUser } from '../auth/authentication';
import { User } from '../database/model/User/User';

export const socketAuthenticateUser =
  (callback: (d: AuthenticationData & { user: User } & any) => any) =>
  async (data: AuthenticationData & any) => {
    const accessToken = data.accessToken;

    const { user } = await authenticateUser(accessToken);

    callback({
      ...data,
      user,
    });
  };

export const socketAuthenticateStaff =
  (callback: (d: AuthenticationData & { user: User } & any) => any) =>
  async (data: AuthenticationData & any) => {
    const accessToken = data.accessToken;

    const { staff } = await authenticateStaff(accessToken);

    callback({
      ...data,
      staff,
    });
  };
