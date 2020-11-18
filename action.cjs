const { gitHubAction } = require("./app.mjs");

async function run() {
    await gitHubAction();
}

run();