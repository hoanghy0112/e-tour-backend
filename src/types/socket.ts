import { Staff } from '../database/model/Company/Staff';

export interface AuthenticationData {
  accessToken: string;
}

export enum SocketServerMessage {
  RESPONSE = 'response',
  ERROR = 'error',
  CREATE_COMPANY_RESULT = 'create-company-result',
  RETRIEVE_TOURIST_ROUTE = 'retrieve-tourist-route',
}

export enum SocketClientMessage {
  PING = 'ping',
  CREATE_COMPANY = 'create-company',
}
