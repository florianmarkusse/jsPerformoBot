var core = require('@actions/core');
var app = require("./out/app.js")

var fs = require("fs");
var path = require("path");

const Octokit = require("@octokit/core");
const { createPullRequest } = require("octokit-plugin-create-pull-request");
const MyOctokit = Octokit.Octokit.plugin(createPullRequest);

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

        let result = (0, app.gitHubAction)(files);

        
        const octo = new MyOctokit({
            auth: repoToken,
        });

        let stringified = String(process.env.GITHUB_REPOSITORY);
        let slash = stringified.indexOf("/");

        let firstOwner = stringified.substr(0, slash);
        let secondRepo = stringified.substr(slash + 1, stringified.length);


        let split = process.env.GITHUB_REF.split("/");
        let baseBranch = "";
        for (let i = 2; i < split.length; i++) {
            baseBranch += split[i];
        }

        let file = "path/to/file1.txt"

        octo
            .createPullRequest({
                owner: firstOwner,
                repo: secondRepo,
                title: "pull request title",
                body: "pull request description",
                base: baseBranch /* optional: defaults to default branch */,
                head: `jsPerformoBot-PR-${baseBranch}-${Date.now()}`,
                changes: [
                {
                    /* optional: if `files` is not passed, an empty commit is created instead */
                    files: {
                        file: "Content for file1",
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