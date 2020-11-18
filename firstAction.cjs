const core = require('@actions/core');
const github = require('@actions/github');

const { graphql } = require("@octokit/graphql");
const { Octokit } = require("@octokit/rest");

import {
  EXTENSIONS_TO_LINT,
  isFileOk,
  getPullRequestInfo,
} from './action/utils'

async function run() {
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

      const prInfo = await getPullRequestInfo({
        graphqlWithAuth,
        prNumber: context.issue.number,
        owner,
        repo
      });

      const sha = prInfo.repository.pullRequest.commits.nodes[0].commit.oid;
      const files = prInfo.repository.pullRequest.files.nodes;

      const filesToLint = files
        .filter((file) => EXTENSIONS_TO_LINT.includes(extname(file.path)) && isFileOk(file.path))
        .map((file) => file.path);
      if (filesToLint.length < 1) {
        const extensionsString = EXTENSIONS_TO_LINT.join(', ');
        console.warn(
          `No files with [${extensionsString}] extensions added or modified in this PR, nothing to lint...`
        );
        return;
      }

      console.log(files);
      console.log(filesToLint);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();