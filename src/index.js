import simpleLogger from 'simple-node-logger';
import { getPopularRepositories } from './repositories/repositories.service.js';
import { createReport } from './reports/reports.service.js';

const logger = simpleLogger.createSimpleLogger();

// TODO david this is a temp transport layar.
// TODO david if it stays, need to add yargs and accept params: language, count, page
const main = async () => {
  try {
    logger.info('Getting relatively popular repositories...');
    const popularRepositories = await getPopularRepositories({ count: 2, page: 50, requestedLanguage: 'javascript' });
    const report = await createReport(popularRepositories);
    logger.info('Report is ready:', JSON.stringify(report, null, 2));
  } catch (e) {
    logger.error(`Caught exception: ${e.message} `, e);
  }
};

main();
