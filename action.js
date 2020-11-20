var core = require('@actions/core');
var app = require("./out/app.js")

async function run() {

    try {
        (0, appgitHubAction)();
    }
    catch (error) {
        core.setFailed(error.message);
      }
}

run();