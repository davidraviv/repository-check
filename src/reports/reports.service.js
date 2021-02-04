import simpleLogger from 'simple-node-logger';
import Joi from 'joi';
import { cloneRepository } from '../repositories/repositories.service.js';
import checks from '../checks/index.js';
import { validateRequest } from '../utils/index.js';
import { repositorySchema } from '../constants.js';

const logger = simpleLogger.createSimpleLogger();

// eslint-disable-next-line import/prefer-default-export
export async function createReport(repositories) {
  const joiSchema = Joi.array().items(repositorySchema).required();
  validateRequest({ joiSchema, params: repositories });

  logger.info(`Creating report for ${repositories.length} repositories`);
  const report = await Promise.all(repositories.map(async (repository) => {
    await cloneRepository(repository);
    const checkResults = await checks(repository);
    // await execShell(`rm -rf ${repositoryPath}`);
    return checkResults;
  }));
  return report;
}
