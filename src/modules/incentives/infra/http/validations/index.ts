import { celebrate, Segments, Joi } from 'celebrate';

export const parameterIdValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.number().required(),
  },
});

export const createOptionIncentiveValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    event_id: Joi.number().required(),
    game_id: Joi.number().required(),
    enable_option: Joi.boolean().required(),
    default_options: Joi.array().items(Joi.string()),
  }),
});

export const createGoalIncentiveValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    event_id: Joi.number().required(),
    game_id: Joi.number().required(),
    goal: Joi.number().required(),
  }),
});
