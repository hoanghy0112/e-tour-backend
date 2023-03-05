import { Request } from 'express';
import { UserInterface } from '../database/model/User/User';
import Keystore from '../database/model/Keystore';
// import ApiKey from '../database/model/ApiKey';

declare interface PublicRequest extends Request {
  apiKey: string;
}

declare interface RoleRequest extends PublicRequest {
  currentRoleCodes: string[];
}

declare interface ProtectedRequest extends RoleRequest {
  user: UserInterface;
  accessToken: string;
  keystore: Keystore;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
