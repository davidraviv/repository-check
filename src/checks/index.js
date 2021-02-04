import simpleLogger from 'simple-node-logger';
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

async function performChecksByLanguage(repository) {
  const { name, language, path } = validateRequest({ joiSchema: repositorySchema, params: repository });

  const allChecks = checkByLanguage[language.toLowerCase()];
  const results = await Promise.all(Object.entries(allChecks).map(async ([checkName, checkImplementation]) => {
    logger.info(`Performing check ${checkName} on repository ${name}`);
    return checkImplementation(repository);
  }));
  return {
    name, language, path, results,
  };
}

export { performChecksByLanguage as default };
