export interface AuthenticationData {
  accessToken: string;
}

export const SocketServerMessage = {
  RESPONSE: 'response',
  ERROR: 'error',
  CREATE_TOUR_RESULT: 'create-tour-result',
  CREATE_ROUTE_RESULT: 'create-route-result',
  EDIT_ROUTE_RESULT: 'edit-route-result',
  RETRIEVE_TOURIST_ROUTES: 'retrieve-tourist-route',
  LIST_TOUR: 'list-tour',
  LIST_ROUTE: 'list-route',
  NEW_ROUTE: 'new-route',
  ROUTE: 'route',
  TOUR: 'tour',
  STAFF_INFO: 'staff-info',
  COMPANY_INFO: 'company-info',
  USER_PROFILE: 'user-profile',

  BOOKED_TICKET: 'booked-ticket',
  UPDATED_TICKET: 'updated-ticket',

  CREATE_RATE_RESULT: 'create-rate-result',
  UPDATED_RATE: 'updated-rate',

  RATE_ITEM: 'rate-item',
  RATE_OF_ROUTE: 'rate-of-route',

  touristRoute: {
    VIEW_POPULAR_ROUTE_RESULT: 'view-popular-route-result',
  },

  savedTouristRoute: {
    SAVED_ROUTE: 'saved-route',
    SAVE_ROUTE_RESULT: 'save-route-result',
    REMOVE_ROUTE_FROM_SAVED_RESULT: 'remove-route-from-saved-result',
  },

  ticket: {
    BOOKED_TICKET_LIST: 'booked-ticket-list',
  },

  voucher: {
    VOUCHER: 'voucher',
    NEW_VOUCHER_LIST: 'new-voucher-list',
    CREATE_VOUCHER_RESULT: 'create-voucher-result'
  }
};

export const SocketClientMessage = {
  PING: 'ping',
  REMOVE_LISTENER: 'remove-listener',
  TEST_WATCHTABLE: 'test-watchtable',

  CREATE_ROUTE: 'create-route',
  CREATE_TOUR: 'create-tour',
  EDIT_ROUTE: 'edit-route',
  FILTER_ROUTE: 'filter-route',
  FILTER_TOUR: 'filter-tour',
  VIEW_ROUTE: 'view-route',
  VIEW_TOUR: 'view-tour',
  VIEW_STAFF_INFO: 'view-staff-info',
  VIEW_COMPANY_INFO: 'view-company-info',
  VIEW_USER_PROFILE: 'view-user-profile',
  VIEW_RECOMMEND_ROUTE: 'view-recommend-route',

  BOOK_TICKET: 'book-ticket',

  CREATE_RATE: 'create-rate',

  VIEW_RATE_OF_ROUTE: 'view-rate-of-route',

  touristRoute: {
    INCREASE_POINT: 'increase-point',
    VIEW_POPULAR_ROUTE: 'view-popular-route',
  },

  savedTouristRoute: {
    VIEW_SAVED_ROUTE: 'view-saved-route',
    SAVE_ROUTE: 'save-route',
    REMOVE_ROUTE_FROM_SAVED: 'remove-route-from-saved',
  },

  ticket: {
    VIEW_BOOKED_TICKET: 'view-booked-ticket',
  },

  voucher: {
    VIEW_BY_VOUCHER_ID: 'view-voucher-by-id',
    VIEW_NEW_VOUCHER: 'view-new-voucher',
    CREATE_VOUCHER: 'create-voucher'
  },
};
