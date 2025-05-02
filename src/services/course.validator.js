import Joi from 'joi';

export const courseValidator = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    teacher: Joi.string().required()
});
