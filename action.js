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

        await Octo.request('POST /repos/{ownerRepo}/git/refs', {
            ownerRepo: process.env.GITHUB_REPOSITORY,
            ref: 'refs/heads/blabla',
            sha: 'e6e68bd5fc0dca570de4648ac473c22041d6acfd'
          })
    }
    catch (error) {
        core.setFailed(error.message);
      }
}

run();