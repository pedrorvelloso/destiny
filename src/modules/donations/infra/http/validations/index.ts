import { celebrate, Joi, Segments } from 'celebrate';

export const parameterIdValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.number().required(),
  },
});
