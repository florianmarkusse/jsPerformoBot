var core = require('@actions/core');
var app = require("./out/app.js")

var fs = require("fs");
var path = require("path");

var octokit = require("@octokit/core");
const { Octokit } = require('@octokit/rest');

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

        const Octo = new Octokit({auth: repoToken});

        let slash = process.env.GITHUB_REPOSITORY.indexOf("/");

        let firstOwner = process.env.GITHUB_REPOSITORY.substr(0, slash);
        let secondRepo = process.env.GITHUB_REPOSITORY.substr(slash + 1, process.env.GITHUB_REPOSITORY.length);

        let result2 = await Octo.request('POST /repos/{owner}/{repo}/git/refs', {
            owner: firstOwner,
            repo: secondRepo,
            ref: 'refs/heads/blabla',
            sha: 'e6e68bd5fc0dca570de4648ac473c22041d6acfd'
          })
        console.log(result2);
    }
    catch (error) {
        core.setFailed(error.message);
      }
}

run();