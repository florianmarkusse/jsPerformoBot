import * as core from '@actions/core';
import * as github from '@actions/core';
import Octokit from '@octokit/rest';
import { graphql } from '@octokit/graphql';

const repoToken = core.getInput('repo-token', { required: true });

try {

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

    const prInfo = await getPullRequestInfo({
        graphqlWithAuth,
        prNumber: context.issue.number,
        owner,
        repo
    });

    console.warn(prInfo.repository.pullRequest.files.nodes);

} catch(error) {
    console.error('Error', err.stack);
    if (err.data) {
        console.error(err.data);
    }
    core.setFailed(err.message);
}