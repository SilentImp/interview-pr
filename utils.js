const { spawnSync } = require('node:child_process');

const createByTemplate = (octokit) => async ({
  targetName,
  org,
  sourceName = 'curator',
  description='Test task for a curator',
}) => {
  const result = await octokit.request(`POST /repos/${org}/${sourceName}/generate`, {
    owner: org,
    name: targetName,
    description,
    include_all_branches: false,
    'private': true,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (result.status !== 201) throw result;
  return result;
};

const create = (octokit) => async ({
  name,
  org,
  description='Code Review',
}) => {
  return await octokit.request(`POST /orgs/${org}/repos`, {
    org,
    name,
    description,
    'private': true,
    has_issues: false,
    has_projects: false,
    has_wiki: false,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
};

const makePullRequest = (octokit) => async ({ owner, repo, head='feature', base='main', title, body}) => {
  const result = await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
    owner,
    repo,
    title,
    body,
    head,
    base,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (result.status > 299) throw result;
  return result;
};

const inviteReviewer = (octokit) => async ({
  pullNumber: pull_number,
  reviewers,
  owner,
  repo,
}) => {
  const result = await octokit.request(`POST /repos/${owner}/${repo}/pulls/${pull_number}/requested_reviewers`, {
    owner,
    repo,
    pull_number,
    reviewers: Array.isArray(reviewers) ? [...reviewers] : [reviewers],
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (result.status > 299) throw result;
  return result;
};

const addCollaborator = (octokit) => async ({
  owner,
  repo,
  collaborator,
  permission,
}) => {
  const result = await octokit.request(`PUT /repos/${owner}/${repo}/collaborators/${collaborator}`, {
    owner,
    repo,
    username: collaborator,
    permission,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (result.status > 299) throw result;
  return result;
};


const clone = (repo, owner, credentials, options = {}) => {
  const response = spawnSync("git", [
    "clone",
    `https://${credentials}@github.com/${owner}/${repo}.git`
  ], options);
  if (response.status !== 0) throw response;
};

const switchOrigin = (repo, owner, credentials, options) => {
  const response = spawnSync("git", [
    "remote",
    "set-url",
    "origin",
    `https://${credentials}@github.com/${owner}/${repo}.git`
  ], options);
  if (response.status !== 0) throw response;
};

const push = (options) => {
  const response = spawnSync("git", [
    "push",
    "-f"
  ], options);
  if (response.status !== 0) throw response;
};

const pull = (options) => {
  const response = spawnSync("git", [
    "pull"
  ], options);
  if (response.status !== 0) throw response;
};

const checkout = (branch, options) => {
  const response = spawnSync("git", [
    "checkout",
    branch
  ], options);
  if (response.status !== 0) throw response;
};

const fetchAll = (options) => {
  const response = spawnSync("git", [
    "fetch",
    "--all"
  ], options);
  if (response.status !== 0) throw response;
};

module.exports = {
  addCollaborator,
  makePullRequest,
  inviteReviewer,
  create,
  clone,
  push,
  pull,
  fetchAll,
  checkout,
  switchOrigin,
  createByTemplate,
};
