import fs from 'fs';
import espree from 'espree';

import { getOnlyJSFiles } from "./common/fileSystem.mjs"

const toCheck = String(process.argv[2]);

let result;
try {
    result = fs.lstatSync(toCheck);
} catch (error) {
    console.error("please make sure the second argument is either a Javascript file or a folder containing any JavaScript files.")
    process.exit(-1);
}

let jsFiles = [];
if (result.isDirectory()) {
    jsFiles = getOnlyJSFiles(toCheck);
} else if (result.isFile()) {
    if (result.endsWith(".js") || result.endsWith(".mjs") || result.endsWith(".cjs")) {
        jsFiles = [toCheck];
    }
}

if (jsFiles.length == 0) {
    console.error("please make sure the second argument is either a Javascript file or a folder containing any JavaScript files.")
    process.exit(-1);
}

jsFiles.forEach(function(fileName) {
    processFile(fileName);
}) 


function processFile(fileName) {
    const extensionRE = /(?:\.([^.]+))?$/;
    const extensionToSourceType = {
        "js": "script",
        "mjs": "module",
        "cjs": "commonjs"
    }

    let fileExtension = extensionRE.exec(fileName)[1];
    const sourceType = extensionToSourceType[fileExtension];


    let data = fs.readFileSync(fileName,
        { encoding: 'utf8', flag: 'r' },
        function (err, data) {
            if (err)
                throw err;
        });

    let ast = espree.parse(data, { tokens: false, ecmaVersion: espree.supportedEcmaVersions.pop(), sourceType: sourceType });
}

