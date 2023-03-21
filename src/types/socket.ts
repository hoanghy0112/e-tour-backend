import { Staff } from '../database/model/Company/Staff';

export interface AuthenticationData {
  accessToken: string;
}

export enum SocketServerMessage {
  RESPONSE = 'response',
}

export enum SocketClientMessage {
  PING = 'ping',
  CREATE_COMPANY = 'create-company',
}
