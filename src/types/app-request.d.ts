import { Request } from 'express';
import { IUser } from '../database/model/User/User';
import Keystore from '../database/model/Keystore';
import { Staff } from '../database/model/Company/Staff';

declare interface PublicRequest extends Request {
  apiKey: string;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCodes: string[];
}

declare interface ProtectedUserRequest extends RoleRequest {
  user: IUser;
  accessToken: string;
  keystore: Keystore;
}

declare interface ProtectedStaffRequest extends RoleRequest {
  staff: Staff;
  accessToken: string;
  keystore: Keystore;
}

declare interface FileRequest extends Request {
  image: Express.Multer.File;
  previewImages: Express.Multer.File[];
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}

declare interface AuthenticationData {
  accessToken: string;
}
