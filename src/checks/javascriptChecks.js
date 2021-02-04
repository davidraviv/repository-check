import { execShell } from '../utils/index.js';

function parseDependencyResponse(response) {
  let score = 100;
  let description = 'All repositories are used';

  if (response && response.length > 0) {
    const [, message] = response.split('\n');
    if (message.includes('Modules in package.json not used in code:')) {
      const [, repoListStr] = message.split(':');
      const repoList = repoListStr.split(', ');
      score = Math.max(100 - repoList.length, 0);
      description = repoListStr.trim();
    } else {
      score = 0;
      description = message;
    }
  }
  return { score, description };
}

export async function dependencyCheck(repository) {
  const { path } = repository;
  const response = await execShell(`./node_modules/dependency-check/cli.js ${path} src/index.js --unused`);
  const { score, description } = parseDependencyResponse(response);
  return {
    check: 'dependency-check', score, description,
  };
}

export async function dummyCheck() {
  return {
    check: 'dummy-check', score: 100, description: 'Place holder for real check',
  };
}
