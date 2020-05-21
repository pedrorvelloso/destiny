import { celebrate, Joi, Segments } from 'celebrate';

export const parameterIdValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.number().required(),
  },
});

export const createEventValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    starts_at: Joi.date().required(),
    ends_at: Joi.date().required(),
  }),
});
