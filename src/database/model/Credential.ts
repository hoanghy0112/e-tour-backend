import { Types, Schema, model } from 'mongoose';

export enum AuthenticationType {
  PASSWORD = 'password',
  GOOGLE = 'google',
}

export interface CredentialInterface {
  _id: Types.ObjectId;
  authenticationType: AuthenticationType;
  email?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
}

const schema = new Schema<CredentialInterface>({
  authenticationType: AuthenticationType,
  email: String,
  password: String,
  accessToken: String,
  refreshToken: String,
});

export const Credential = model<CredentialInterface>('Credential', schema);
