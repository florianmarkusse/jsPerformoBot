var core = require('@actions/core');
var app = require("./out/app.js")

var fs = require("fs");
var path = require("path");

const Octokit = require("@octokit/core");
const { createPullRequest } = require("octokit-plugin-create-pull-request");
const MyOctokit = Octokit.Octokit.plugin(createPullRequest);

let greetings = "Hello,\n\n"
let goodBye = "Kind regards,\nFlorian Markusse, author of jsPerformoBot";
let disclaimer = "NB: this bot generates false positives at times, please review the pull request.\n\n"

const fixTypes = {
    UNDEFINED_READ: "undefinedRead",
    REVERSE_ARRAY_WRITE: "reverseArrayWrite",
    UNNECESSARYBINARYOPERATION: "unnecessaryBinaryOperation",
}

const messages = [
    // Undefined read
    "A variable that is *undefined* was read from. Propose to change the assignment to *undefined* if intended behaviour.\n\n",
    // Reverse array write
    "An array is written to in reverse order. This cause a degradation in performance, thus I propose to change the order the array is written to.\n\n",
    // Unnecessary binary operation.
    "A binary operation is performed where the results is already known or partially known. Propose to remove this binary operation.\n\n",
];



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

            let technicalPart = "";

            for (let i = 0; i < results.length; i+=3) {
                let split = results[i].split("/");
                let filePath = "";

                for (let i = 6; i < split.length; i++) {
                    if (i == split.length - 1) {
                        filePath += split[i];
                    } else {
                        filePath += split[i] + "/";
                    }
                }

                filesObject[filePath] = results[i+1];

                technicalPart += `In file *${filePath}* I found the following issue:\n`
                switch (results[i + 2]){
                    case fixTypes.UNDEFINED_READ:
                        technicalPart += messages[0];
                        break;
                    case fixTypes.REVERSE_ARRAY_WRITE:
                        technicalPart += messages[1];
                        break;
                    case fixTypes.UNNECESSARYBINARYOPERATION:
                        technicalPart += messages[2];
                        break;
                }
            }

            console.log(filesObject);

            octo
                .createPullRequest({
                    owner: firstOwner,
                    repo: secondRepo,
                    title: "jsPerformoBot: performance improvement suggestion(s)",
                    body: greetings + technicalPart + disclaimer + goodBye,
                    base: baseBranch /* optional: defaults to default branch */,
                    head: `jsPerformoBot-PR-${baseBranch}-${Date.now()}`,
                    changes: [
                    {
                        /* optional: if `files` is not passed, an empty commit is created instead */
                        files: filesObject,
                        commit: "Chore: performance suggestion(s)",
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