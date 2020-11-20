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

        let results = (0, app.gitHubAction)(files);
        console.log(results);

        
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

        if (results.length === 0) {
            return;
        }
        else {

            
            

            let filesObject = {};

            for (let i = 0; i < results.length; i++) {
                let split = results[i]
                let filePath = "";

                for (let i = 6; i < split.length; i++) {
                    if (i == split.length - 1) {
                        filePath += split[i];
                    } else {
                        filePath += split[i] + "/";
                    }
                }

                filesObject[filePath] = results[i+1];
            }

            console.log(filesObject);

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
                        files: filesObject,
                        commit:
                        "new commit",
                    },
                    ],
                })
            .then((pr) => console.log(pr.data.number));
        }
    }
    catch (error) {
        core.setFailed(error.message);
      }
}

run();