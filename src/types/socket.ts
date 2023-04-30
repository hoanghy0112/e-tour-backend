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
  LIST_ROUTE = 'list-route',
  NEW_ROUTE = 'new-route',
  ROUTE = 'route',
  TOUR = 'tour',
  STAFF_INFO = 'staff-info',
  COMPANY_INFO = 'company-info',
  USER_PROFILE = 'user-profile',

  BOOKED_TICKET = 'booked-ticket',
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
  VIEW_STAFF_INFO = 'view-staff-info',
  VIEW_COMPANY_INFO = 'view-company-info',
  VIEW_USER_PROFILE = 'view-user-profile',
  VIEW_RECOMMEND_ROUTE = 'view-recommend-route',

  BOOK_TICKET = 'book-ticket',
}
