import { celebrate, Joi, Segments } from 'celebrate';

export const parameterIdValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.number().required(),
  },
});

export const allocateValidatiom = celebrate({
  [Segments.BODY]: {
    incentive_option_id: Joi.number().required(),
  },
});
