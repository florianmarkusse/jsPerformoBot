const core = require('@actions/core');
const github = require('@actions/github');

const { graphql } = require("@octokit/graphql");
const { Octokit } = require("@octokit/rest");

try {
  console.log("testing");
} catch (error) {
  core.setFailed(error.message);
}