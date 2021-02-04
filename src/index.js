import simpleLogger from 'simple-node-logger';
import { getPopularRepositories } from './repositories/repositories.service.js';
import { createReport } from './reports/reports.service.js';

const logger = simpleLogger.createSimpleLogger();

const main = async () => {
  try {
    logger.info('Getting most popular repositories...');
    const popularRepositories = await getPopularRepositories({ count: 2, requestedLanguage: 'javascript' });
    const report = await createReport(popularRepositories);
    logger.info('Report is ready:', JSON.stringify(report, null, 2));
  } catch (e) {
    logger.error(`Caught exception: ${e.message} `, e);
  }
};

main();
