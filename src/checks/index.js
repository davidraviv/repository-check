import simpleLogger from 'simple-node-logger';
import Joi from 'joi';
import * as javascriptChecks from './javascriptChecks.js';
import { validateRequest } from '../utils/index.js';
import { repositorySchema } from '../constants.js';

const logger = simpleLogger.createSimpleLogger();

const checkByLanguage = {
  javascript: {
    dependencyCheck: javascriptChecks.dependencyCheck,
    dummyCheck: javascriptChecks.dummyCheck,
  },
};

export const checkResponseSchema = Joi.object({
  check: Joi.string().required(),
  score: Joi.number().min(0).max(100).required(),
  description: Joi.string().required(),
}).required();

// TODO david should return only the results. the rest should be added in the calling function in the repositories module
async function performChecksByLanguage(repository) {
  const {
    name, language, path, htmlUrl,
  } = validateRequest({ joiSchema: repositorySchema, params: repository });

  const allChecks = checkByLanguage[language.toLowerCase()];
  const results = await Promise.all(Object.entries(allChecks).map(async ([checkName, checkImplementation]) => {
    logger.info(`Performing check ${checkName} on repository ${name}`);
    const checkResponse = await checkImplementation(repository);
    validateRequest({ joiSchema: checkResponseSchema, params: checkResponse });
    return checkResponse;
  }));
  return {
    name, language, path, htmlUrl, results,
  };
}

export { performChecksByLanguage as default };
