import Joi from 'joi';

export const supportedLanguages = ['javascript'];

export const repositorySchema = Joi.object({
  name: Joi.string().trim().required(),
  path: Joi.string().trim().required(),
  cloneUrl: Joi.string().trim().required(),
  language: Joi.string().lowercase().valid(...supportedLanguages).required(),
}).required();
