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

  TOUR_EVENTS: {
    DELETE_TOUR_RESULT: 'delete-tour-result',
    UPDATE_TOUR_RESULT: 'update-tour-result',
  },

  touristRoute: {
    VIEW_POPULAR_ROUTE_RESULT: 'view-popular-route-result',
    FOLLOW_TOURIST_ROUTE_RESULT: 'follow-tourist-route-result',
    UNFOLLOW_TOURIST_ROUTE_RESULT: 'unfollow-tourist-route-result',
  },

  savedTouristRoute: {
    SAVED_ROUTE: 'saved-route',
    SAVE_ROUTE_RESULT: 'save-route-result',
    REMOVE_ROUTE_FROM_SAVED_RESULT: 'remove-route-from-saved-result',
  },

  ticket: {
    BOOKED_TICKET_LIST: 'booked-ticket-list',
    UPDATE_TICKET_RESULT: 'update-ticket-result',
  },

  voucher: {
    VOUCHER: 'voucher',
    NEW_VOUCHER_LIST: 'new-voucher-list',
    CREATE_VOUCHER_RESULT: 'create-voucher-result',
  },

  contactCompany: {
    FOLLOW_COMPANY_RESULT: 'follow-company-result',
    UNFOLLOW_COMPANY_RESULT: 'unfollow-company-result',
  },

  notification: {
    NEW_NOTIFICATION_LIST: 'new-notification-list',
    READ_NOTIFICATION_RESULT: 'read-notification-result',
  },
  chat: {
    NEW_CHAT_MESSAGE: 'new-chat-message',
    CHAT_MESSAGE_LIST: 'chat-message-list',
    CHAT_ROOM_LIST: 'chat-room-list',
    CREATE_CHAT_RESULT: 'create-chat-result',
    CREATE_CHAT_MESSAGE_RESULT: 'create-chat-message-result',
  },
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

  TOUR: {
    DELETE_TOUR: 'delete-tour',
    UPDATE_TOUR: 'update-tour',
  },

  touristRoute: {
    INCREASE_POINT: 'increase-point',
    VIEW_POPULAR_ROUTE: 'view-popular-route',
    FOLLOW_TOURIST_ROUTE: 'follow-tourist-route',
    UNFOLLOW_TOURIST_ROUTE: 'unfollow-tourist-route',
  },

  savedTouristRoute: {
    VIEW_SAVED_ROUTE: 'view-saved-route',
    SAVE_ROUTE: 'save-route',
    REMOVE_ROUTE_FROM_SAVED: 'remove-route-from-saved',
  },

  ticket: {
    VIEW_BOOKED_TICKET: 'view-booked-ticket',
    UPDATE_TICKET: 'update-ticket',
    VIEW_DETAIL_TICKET: 'view-detail-ticket',
  },

  voucher: {
    VIEW_BY_VOUCHER_ID: 'view-voucher-by-id',
    VIEW_NEW_VOUCHER: 'view-new-voucher',
    CREATE_VOUCHER: 'create-voucher',
  },

  contactCompany: {
    FOLLOW_COMPANY: 'follow-company',
    UNFOLLOW_COMPANY: 'unfollow-company',
  },

  notification: {
    VIEW_NEW_NOTIFICATION: 'view-new-notification',
    READ_NOTIFICATION: 'read-notification',
  },
  chat: {
    VIEW_CHAT_ROOM_LIST: 'view-chat-room-list',
    VIEW_CHAT_MESSAGE: 'view-chat-message',
    CREATE_CHAT: 'create-chat',
    CREATE_CHAT_MESSAGE: 'create-chat-message',
  },
};
