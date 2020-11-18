import { gitHubAction } from "./app.mjs";

async function run() {
    await gitHubAction();
}

run();