export enum RouteErrorType {
  ROUTE_NOT_FOUND = 'NOT_FOUND',
}

export class RouteError extends Error {
  constructor(public type: RouteErrorType, public message: string = 'error') {
    super(type);
  }
}
