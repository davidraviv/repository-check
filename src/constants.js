import Joi from 'joi';

export const supportedLanguages = ['javascript'];

// TODO david repository schema should be in the repository dal
export const repositorySchema = Joi.object({
  name: Joi.string().trim().required(),
  path: Joi.string().trim().required(),
  cloneUrl: Joi.string().trim().uri().required(),
  htmlUrl: Joi.string().trim().uri().required(),
  language: Joi.string().lowercase().valid(...supportedLanguages).required(),
}).required();
