export enum TourErrorType {
  TOUR_NOT_FOUND = 'TOUR_NOT_FOUND',
}

export class TourError extends Error {
  constructor(public type: TourErrorType, public message: string = 'error') {
    super(type);
  }
}
