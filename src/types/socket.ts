import { Staff } from '../database/model/Company/Staff';

export interface AuthenticationData {
  accessToken: string;
}

export enum SocketServerEvent {
  RESPONSE = 'response',
}

export enum SocketClientEvent {
  PING = 'ping',
}
