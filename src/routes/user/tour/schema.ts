import Joi from 'joi';
import { TourType } from '../../../database/model/Company/Tour';

export default {
  viewTour: {
    byFilter: Joi.object().keys({
      touristRoute: Joi.string(),
      from: Joi.date(),
      to: Joi.date(),
    }),
    byId: Joi.object().keys({
      id: Joi.string(),
    }),
  },
  createTour: Joi.object().keys({
    name: Joi.string().optional().default(''),
    description: Joi.string().optional().default(''),
    from: Joi.date().required(),
    to: Joi.date().required(),
    price: Joi.number().optional().default(0),
    type: Joi.string()
      .valid(...Object.values(TourType))
      .default(TourType.NORMAL),
    image: Joi.any(),
    touristRoute: Joi.string().required(),
  }),
  updateTour: Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string().optional().default(''),
    description: Joi.string().optional().default(''),
    from: Joi.date().optional(),
    to: Joi.date().optional(),
    price: Joi.number().optional().default(0),
    type: Joi.string()
      .valid(...Object.values(TourType))
      .default(TourType.NORMAL),
    image: Joi.any(),
    touristRoute: Joi.string().optional(),
  }),
  deleteTour: Joi.array().items(Joi.string()),
};
