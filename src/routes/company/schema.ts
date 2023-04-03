import Joi from 'joi';
import { TouristsRouteType } from '../../database/model/Company/TouristsRoute';
import { TourType } from '../../database/model/Company/Tour';

export default {
  credential: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),
  signup: Joi.object().keys({
    name: Joi.string().required().min(1),
    email: Joi.string().required().email(),
    description: Joi.string().optional().min(1),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
    username: Joi.string().required().min(1),
    password: Joi.string().required().min(6),
  }),
  createTourRoute: Joi.object().keys({
    reservationFee: Joi.number().optional().default(0),
    name: Joi.string().required().min(10),
    description: Joi.string().required().min(10),
    type: Joi.string()
      .valid(...Object.values(TouristsRouteType))
      .default(TouristsRouteType.COUNTRY),
    route: Joi.array().items(Joi.string()),
    image: Joi.any(),
  }),
  editTourRoute: Joi.object().keys({
    _id: Joi.string().required(),
    reservationFee: Joi.number().optional().default(0),
    name: Joi.string().optional().min(1),
    description: Joi.string().optional().min(1),
    type: Joi.string()
      .valid(...Object.values(TouristsRouteType))
      .default(TouristsRouteType.COUNTRY),
    route: Joi.array().items(Joi.string()),
    image: Joi.any(),
  }),
  createTour: Joi.object().keys({
    from: Joi.date().required(),
    to: Joi.date().required(),
    type: Joi.string()
      .valid(...Object.values(TourType))
      .default(TourType.NORMAL),
    image: Joi.string(),
    touristRoute: Joi.string().required(),
  }),
};
