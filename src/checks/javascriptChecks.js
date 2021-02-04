import { spawnShell } from '../utils/index.js';

// eslint-disable-next-line import/prefer-default-export
export async function dependencyCheck(repository) {
  const { path } = repository;
  const result = await spawnShell({
    command: './node_modules/dependency-check/cli.js',
    options: [`${path}`, 'src/index.js', '--unused'],
  });
  return {
    check: 'dependency-check', score: result,
  };
}

export async function dummyCheck() {
  return {
    check: 'dummy-check', score: 'success',
  };
}
