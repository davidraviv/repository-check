import { exec as childExec, spawn } from 'child_process';
import util from 'util';
import simpleLogger from 'simple-node-logger';

const exec = util.promisify(childExec);

const logger = simpleLogger.createSimpleLogger({ level: 'debug' });

export async function execShell(command) {
  const { stdout, stderr } = await exec(command);
  if (stderr) {
    logger.error(`stderr: ${stderr}`);
    throw new Error(stderr);
  }
  logger.debug(`exec stdout for "${command}": ${stdout}`);
  return stdout;
}

export async function spawnShell({ command, options }) {
  try {
    const child = spawn(command, options);

    child.on('exit', (code) => {
      logger.debug(`Spawn exit code is: ${code}`);
    });

    child.on('error', (errMessage) => {
      logger.error(`Spawn error: ${errMessage}`);
    });

    child.on('close', (code) => {
      logger.debug(`Spawn closed: ${code}`);
    });

    const output = [];
    for await (const data of child.stdout) {
      output.push(data);
      logger.debug(`stdout from the child: ${data}`);
    }
    return output.join(' ');
  } catch (e) {
    logger.error(`Spawn exception: ${e.message}`, e);
    return e.message;
  }
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
