export enum RateErrorType {
  RATE_NOT_FOUND = 'RATE_NOT_FOUND',
  USER_HAVE_NOT_VISITED = 'USER_HAVE_NOT_VISITED',
}

export class RateError extends Error {
  constructor(public type: RateErrorType, public message: string = 'error') {
    super(type);
  }
}
