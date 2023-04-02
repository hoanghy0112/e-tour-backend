import { Staff } from '../database/model/Company/Staff';

export interface AuthenticationData {
  accessToken: string;
}

export enum SocketServerMessage {
  RESPONSE = 'response',
  ERROR = 'error',
  CREATE_TOUR_RESULT = 'create-tour-result',
  CREATE_ROUTE_RESULT = 'create-route-result',
  EDIT_ROUTE_RESULT = 'edit-route-result',
  RETRIEVE_TOURIST_ROUTES = 'retrieve-tourist-route',
  LIST_TOUR = 'list-tour',
  NEW_ROUTE = 'new-route',
  ROUTE = 'route',
  TOUR = 'tour',
}

export enum SocketClientMessage {
  PING = 'ping',
  CREATE_ROUTE = 'create-route',
  CREATE_TOUR = 'create-tour',
  EDIT_ROUTE = 'edit-route',
  FILTER_ROUTE = 'filter-route',
  FILTER_TOUR = 'filter-tour',
  VIEW_ROUTE = 'view-route',
  VIEW_TOUR = 'view-tour',
}
