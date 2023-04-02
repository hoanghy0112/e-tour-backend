import TourModel, { Tour } from '../../../model/Company/Tour';

async function create(tour: Tour): Promise<Tour | null> {
  const createdTour = await TourModel.create(tour);
  return createdTour;
}

export default {
  create,
};
