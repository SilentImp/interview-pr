const { Octokit } = require('octokit');
const path = require('path');
const fs = require('fs');

const {
  makePullRequest,
  create,
  inviteReviewer,
  addCollaborator,
  clone,
  push,
  pull,
  fetchAll,
  checkout,
  switchOrigin,
} = require('./utils.js');

/**
 * This method create a copy of repo and make a pull request between 2 branches
 * @param {string} token - token to use GitHub API
 * @param {string} username - user from name of which we operate GitHub API
 * @param {string} curator - user who should do the review
 * @param {string} owner - org or user in which repos will be located
 * @param {string} source - repo, which we copy
 * @param {string} target - name of repo we create
 * @param {string} from - branch from which we make PR
 * @param {string} to - branch to which we make PR
 * @param {string} localPathToRepo - where to clone repo, excluding repo name
 * @param {string} PRTitle - PR title
 * @param {string} PRDesc - PR description in markdown format
 */

const duplicateRepoAndCreatePR = async ({
  token,
  username,
  curator,
  owner,
  source,
  target,
  from,
  to,
  localPathToRepo,
  PRTitle,
  PRDesc,
}) => {

  const credentials = `${username}:${token}`;
  const octokit = new Octokit({
    auth: token,
  });

  const options = {
    PATH: process.env.PATH,
    cwd: path.join(localPathToRepo, target),
  };

  await create(octokit)({
    name: target,
    org: owner,
  });


  clone(target, owner, credentials);
  switchOrigin(source, owner, credentials, options);
  fetchAll(options);
  checkout(to, options);
  pull(options);
  switchOrigin(target, owner, credentials, options);
  push(options);
  switchOrigin(source, owner, credentials, options);
  checkout(from, options);
  switchOrigin(target, owner, credentials, options);
  push(options);

  const { data: { number: pullNumber } } = await makePullRequest(octokit)({
    owner,
    repo: target,
    head: from,
    base: to,
    title: PRTitle,
    body: PRDesc,
  });

  await addCollaborator(octokit)({
    owner,
    repo: target,
    collaborator: curator,
    permission: 'maintain',
  });

  fs.rmSync(options.cwd, { recursive: true, force: true });

  try {
    await inviteReviewer(octokit)({
      pullNumber,
      reviewers: curator,
      owner,
      repo: target,
    });
  } catch (error) {
    // Не можна додати ревьювером людину яка ще не прийняла запрошення у репозиторій
  }
};

module.exports = {
  duplicateRepoAndCreatePR
};
