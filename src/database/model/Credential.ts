import { Types, Schema, model } from 'mongoose';

export enum AuthenticationType {
  PASSWORD = 'password',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export enum UserType {
  CLIENT = 'client',
  STAFF = 'staff',
}

export interface Credential {
  _id: Types.ObjectId;
  authenticationType: AuthenticationType;
  userType: UserType;
  username?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
}

const schema = new Schema<Credential>({
  authenticationType: AuthenticationType,
  userType: UserType,
  username: String,
  password: String,
  accessToken: String,
  refreshToken: String,
});

export const CredentialModel = model<Credential>('Credential', schema);
