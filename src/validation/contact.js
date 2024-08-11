import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string()
    .length(13)
    .pattern(/[6-9]{1}[0-9]{9}/)
    .required(),
  email: Joi.string().email().required(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  isFavourite: Joi.boolean(),
});

export const contactFavouriteSchema = Joi.object({
  isFavourite: Joi.boolean().required(),
});
