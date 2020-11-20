var core = require('@actions/core');
var app = require("./out/app.js")

async function run() {

    try {
        (0, app.gitHubAction)();
    }
    catch (error) {
        core.setFailed(error.message);
      }
}

run();