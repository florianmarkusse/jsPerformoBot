import * as core from '@actions/core';
import Octokit from '@octokit/rest';
import * as github from '@actions/github';
import { graphql } from '@octokit/graphql';

try {
  console.log("testing");
} catch (error) {
  core.setFailed(error.message);
}