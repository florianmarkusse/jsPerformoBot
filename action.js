var core = require('@actions/core');
var app = require("./out/app.js")

var fs = require("fs");
var path = require("path");

var OctoKit = require("@octokit/core");
var createPullRequest  = require('octokit-plugin-create-pull-request');

// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist) {
    
    let files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            filelist.push(path.join(dir, file));
        }
    });
    return filelist;
};

async function run() {
    try {

        const repoToken = core.getInput('repo-token');
      
        let workingDirectory = process.env.GITHUB_WORKSPACE;
  
        let files = walkSync(workingDirectory, []).filter((file) => file.includes(".js") || file.includes(".mjs"));
        console.log(files);

        //(0, app.gitHubAction)(files);

        const MyOctokit = OctoKit.plugin(createPullRequest);
        const octo = new MyOctokit({
            auth: repoToken,
        });

        let stringified = String(process.env.GITHUB_REPOSITORY);
        let slash = stringified.indexOf("/");

        let firstOwner = stringified.substr(0, slash);
        let secondRepo = stringified.substr(slash + 1, stringified.length);

        octokit
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
    }
    catch (error) {
        core.setFailed(error.message);
      }
}

run();