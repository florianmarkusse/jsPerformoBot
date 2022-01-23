import fs from 'fs';

export function getOnlyJSFiles(directory) {
    const allFiles = getAllFilesRecursively(directory);
    let jsFiles = [];

    allFiles.forEach(file => {
        if (file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".cjs")) {
            jsFiles.push(file);
        }
    })

    return jsFiles;
}

function getAllFilesRecursively(mainDirectory) {

    let fileNames = fs.readdirSync(mainDirectory);

    for (let i = 0; i < fileNames.length; i++) {
        if (fs.lstatSync(mainDirectory + "\\" + fileNames[i]).isDirectory()) {
            fileNames[i] = getAllFilesRecursively(mainDirectory + "\\" + fileNames[i])
            i += fileNames[i].length - 1;
            fileNames = flatten(fileNames);
        } else {
            fileNames[i] = mainDirectory + "\\" + fileNames[i];
        }
    }

    return fileNames;
}

function flatten(input) {
    const stack = [...input];
    const res = [];
    while (stack.length) {
        // pop value from stack
        const next = stack.pop();
        if (Array.isArray(next)) {
            // push back array items, won't modify the original input
            stack.push(...next);
        } else {
            res.push(next);
        }
    }
    // reverse to restore input order
    return res.reverse();
}