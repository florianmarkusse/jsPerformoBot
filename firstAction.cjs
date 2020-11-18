const core = require('@actions/core');
const github = require('@actions/github');

const { graphql } = require("@octokit/graphql");
const { Octokit } = require("@octokit/rest");

const { existsSync } = require("fs");
const { extname } = require("path");
const { join } = require("path");
const { espree } = require("espree");

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

      console.log(files);

      const filesToLint = files
        .filter((file) => EXTENSIONS_TO_LINT.includes(extname(file.path)))
        .map((file) => file.path);
      if (filesToLint.length < 1) {
        const extensionsString = EXTENSIONS_TO_LINT.join(', ');
        console.warn(
          `No files with [${extensionsString}] extensions added or modified in this PR, nothing to lint...`
        );
        return;
      }

      console.log(filesToLint);
      console.log(sha);

      const workingDirectory = process.env.GITHUB_WORKSPACE_WORKSPACE;

      let firstFile = join(workingDirectory, filesToLint[0]);
      console.log(firstFile);

      let data = fs.readFileSync(firstFile, function read(err, data) {
        if (err) {
            throw err;
        }
      });

      let ast = espree.parse(data, { tokens: false, ecmaVersion: 11 , sourceType: "module"});
      console.log(ast);

  } catch (error) {
    core.setFailed(error.message);
  }
}

const EXTENSIONS_TO_LINT = [
  '.mjs',
  '.js',
];

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