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
  _id?: Types.ObjectId;
  authenticationType: AuthenticationType;
  userType: UserType;
  username?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
  uid?: string;
}

const schema = new Schema<Credential>({
  authenticationType: {
    type: String,
    enum: Object.values(AuthenticationType),
  },
  userType: {
    type: String,
    enum: Object.values(UserType),
  },
  username: {
    type: String,
    unique: true,
  },
  password: String,
  accessToken: String,
  refreshToken: String,
  uid: {
    type: String,
    default: '',
  },
});

export const CredentialModel = model<Credential>('Credential', schema);
