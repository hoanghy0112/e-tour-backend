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

export interface CredentialInterface {
  _id: Types.ObjectId;
  authenticationType: AuthenticationType;
  userType: UserType;
  username?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
}

const schema = new Schema<CredentialInterface>({
  authenticationType: AuthenticationType,
  userType: UserType,
  username: String,
  password: String,
  accessToken: String,
  refreshToken: String,
});

export const Credential = model<CredentialInterface>('Credential', schema);
