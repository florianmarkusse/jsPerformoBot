const core = require('@actions/core');
const github = require('@actions/github');

const { graphql } = require("@octokit/graphql");
const { Octokit } = require("@octokit/rest");

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

    console.log(prInfo.prNumber);

    const files = prInfo.repository.pullRequest.files.nodes;

    console.log(files);

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function getPullRequestInfo(
  {
    graphqlWithAuth, owner, repo, prNumber
  }
) {
  const gql = (s) => s.join('');
  return graphqlWithAuth(
    gql`
      query($owner: String!, $name: String!, $prNumber: Int!) {
        repository(owner: $owner, name: $name) {
          pullRequest(number: $prNumber) {
            files(first: 100) {
              nodes {
                path
              }
            }
            commits(last: 1) {
              nodes {
                commit {
                  oid
                }
              }
            }
          }
        }
      }
    `,
    {
      owner,
      name: repo,
      prNumber
    }
  );
}

run();