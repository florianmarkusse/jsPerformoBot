import OctoKit from "@octokit/core";
import pkg from '@octokit/rest';
const { Octokit } = pkg;
import createPullRequest from "octokit-plugin-create-pull-request";



const octo = Octokit.plugin(
    createPullRequest
);

octo
            .createPullRequest({
                owner: firstOwner,
                repo: secondRepo,
                title: "pull request title",
                body: "pull request description",
                //base: "main" /* optional: defaults to default branch */,
                head: "pull-request-branch-name",
                changes: [
                {
                    /* optional: if `files` is not passed, an empty commit is created instead */
                    files: {
                    "path/to/file1.txt": "Content for file1",
                    },
                    commit:
                    "new commit",
                },
                ],
            })
        .then((pr) => console.log(pr.data.number));