import simpleLogger from 'simple-node-logger';
import Joi from 'joi';
import { getPopular } from '../git-remote/git.client.js';
import { execShell, validateRequest } from '../utils/index.js';
import { repositorySchema, supportedLanguages } from '../constants.js';

const logger = simpleLogger.createSimpleLogger();

/**
 *
 * @param { count, requestedLanguage }
 * @returns {Promise<*>}
 */
export async function getPopularRepositories(params) {
  const joiSchema = Joi.object({
    count: Joi.number().min(1),
    page: Joi.number().min(0),
    requestedLanguage: Joi.string().trim().lowercase().valid(...supportedLanguages),
  });
  const { count, page, requestedLanguage } = validateRequest({ joiSchema, params });

  const rawRepositories = await getPopular({ count, page, requestedLanguage });
  return rawRepositories.items.map(({
    name, clone_url: cloneUrl, html_url: htmlUrl, language,
  }) => ({
    name, cloneUrl, htmlUrl, language, path: `./repositories/${name}`,
  }));
}

export async function cloneRepository(repository) {
  const { name, cloneUrl, path } = validateRequest({ joiSchema: repositorySchema, params: repository });

  const existingFolder = await execShell(`if [ -d ${path} ]; then echo ${path}; fi`);
  if (existingFolder.trim() !== path) {
    logger.info(`Cloning repository ${name}`);
    await execShell(`mkdir -p ${path}; git clone ${cloneUrl} ${path}`);
  } else {
    logger.info(`Repository ${name} exists, skipping cloning`);
  }
}

export async function deleteRepository(repository) {
  const { path } = validateRequest({ joiSchema: repositorySchema, params: repository });
  await execShell(`rm -rf ${path}`);
}

// TODO david add function checkRepository(repository)
