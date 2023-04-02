import { Staff } from '../database/model/Company/Staff';

export interface AuthenticationData {
  accessToken: string;
}

export enum SocketServerMessage {
  RESPONSE = 'response',
  ERROR = 'error',
  CREATE_ROUTE_RESULT = 'create-route-result',
  RETRIEVE_TOURIST_ROUTES = 'retrieve-tourist-route',
  NEW_ROUTE = 'new-route',
}

export enum SocketClientMessage {
  PING = 'ping',
  CREATE_ROUTE = 'create-route',
  FILTER_ROUTE = 'filter-route',
}
