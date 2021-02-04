import { exec as childExec } from 'child_process';
import util from 'util';
import simpleLogger from 'simple-node-logger';

const exec = util.promisify(childExec);

const logger = simpleLogger.createSimpleLogger({ level: 'debug' });

export async function execShell(command) {
  let stdout;
  let stderr;
  let exceptionMessage;
  try {
    ({ stdout, stderr } = await exec(command));
  } catch (e) {
    exceptionMessage = e.message;
  }
  return exceptionMessage || stdout || stderr;
}

export function validateRequest({ joiSchema, params }) {
  const { error, value } = joiSchema.validate(params);
  if (error) {
    const { message } = error.details[0];
    const errorMessage = `Request failed validation: ${message}`;
    logger.error(errorMessage);
    throw Error(errorMessage);
  }
  return value;
}
