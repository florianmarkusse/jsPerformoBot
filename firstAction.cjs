const core = require('@actions/core');
const github = require('@actions/github');

const { graphql } = require("@octokit/graphql");
const { Octokit } = require("@octokit/rest");

try {
  console.log("testing");

  const repoToken = core.getInput('repo-token');

  const octokit = new Octokit({
    auth: `token ${repoToken}`,
    userAgent: 'Branch Protection script',
    baseUrl: `https://api.github.com`,
    log: {
      debug: () => {
      },
      info: () => {
      },
      warn: console.warn,
      error: console.error
    },
    previews: ['antiope-preview']
  });

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${repoToken}`
    }
  });
  const { context } = github;
  const { owner, repo } = context.repo;

  console.log(owner);
  console.log(repo);

} catch (error) {
  core.setFailed(error.message);
}