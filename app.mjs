import fs from 'fs';
import espree from 'espree';
import escodegen from 'escodegen';
import lodash from 'lodash';


import { processASTNode } from './node_types/nodeType.mjs';
import { clearVariablesMap, getVariables } from './types/variable.mjs';
import { getFixSet } from './fixes/fix.mjs';
import { clearFixSet } from './fixes/fix.mjs';
import { addToUnfixableSet } from './fixes/fix.mjs';
import { containsInUnfixableSet } from './fixes/fix.mjs';

let fileStringsToCheck = [];
let filesFixed = [];
let deepCopyAST;
let batchMode = true;

let inputDirectory;
let outputDirectory;

let procVarLength = process.argv.length;
for (let i = 0; i < procVarLength; i++) {
    console.log(String(process.argv[i]));
}

if (String(process.argv[2]).endsWith(".js") || String(process.argv[2]).endsWith(".mjs")) { 
    fileStringsToCheck[0] = './test_files/' + String(process.argv[2]);
    batchMode = false;
} else {
    // Batch mode
    if (process.argv.length != 4) {
        console.log("Specify input directory and output directory, e.g.: npm run bar C:\\testositories C:\\incorrectFiles");
        throw Error();
    } else {
        inputDirectory = String(process.argv[2]) + "\\";
        outputDirectory = String(process.argv[3]) + "\\";
    }

    let result = getAllFilesRecursively(inputDirectory);
    fileStringsToCheck = getOnlyJSFiles(result);
}

for (let i = 0; i < fileStringsToCheck.length; i++) {

    const fileString = fileStringsToCheck[i];

    if (fileString.includes('.min')) {
        continue;
    }

    console.log(`Reading file ${fileString}`);
    let data = fs.readFileSync(fileString, function read(err, data) {
        if (err) {
            throw err;
        }
    });
    

    let ast;
    try {
        ast = espree.parse(data, { tokens: false, ecmaVersion: 11 , sourceType: "module"});
    } catch(err) {
        continue;
    }
    deepCopyAST = lodash.cloneDeep(ast);
    
    let previousFix;
    let fixToDo;
    let foundFix = false;
    let fixesApplied = [];
        do {
            // The processing happens here
            processAST(ast);

            let iterator = getFixSet().values();
            fixToDo = iterator.next().value;
    
            while ((previousFix !== undefined && fixToDo !== undefined && fixToDo.isEqualTo(previousFix)) || containsInUnfixableSet(fixToDo)) {
                addToUnfixableSet(fixToDo);
                fixToDo = iterator.next().value;
            } 
    
    
            if (fixToDo !== undefined) {
                fixToDo.fix(ast);
                if (!lodash.isEqual(ast, deepCopyAST)) {
                    foundFix = true;
                    fixesApplied.push(fixToDo);
                }
                ast = espree.parse(escodegen.generate(ast), { tokens: false, ecmaVersion: 11 , sourceType: "module"});
                previousFix = fixToDo;
            }
        } while(fixToDo !== undefined/*false*/);
    
        if (foundFix) {
            fixesApplied.forEach(fix => {
                console.log(fix);
            });
            filesFixed.push(fileString);

            if (batchMode) {
                batchWrite(fileString, data, ast);
            } else {
                testWrite(ast);
            }

        }
}

function processAST(ast) {

    clearGlobals();
    processASTNode(ast);
        
    /*
    getVariables()[0].forEach(element => {
        console.log(element);
    });
    
    
    getFixSet().forEach(fix => {
        console.log(fix);
        console.log(fix.nodeToChange);
    })
    */
    
    
    return ast;
}

function clearGlobals() {
    clearVariablesMap();
    clearFixSet();
}

function getAllFilesRecursively(fileName) {

    let fileNames = fs.readdirSync(fileName);

    for (let i = 0; i < fileNames.length; i++) {
        if (fs.lstatSync(fileName + "\\" + fileNames[i]).isDirectory()) {
            fileNames[i] = getAllFilesRecursively(fileName + "\\" + fileNames[i])
            i += fileNames[i].length - 1;
            fileNames = flatten(fileNames);
        } else {
            fileNames[i] = fileName + "\\" + fileNames[i];
        }
    }

    return fileNames;
}

function flatten(input) {
    const stack = [...input];
    const res = [];
    while(stack.length) {
      // pop value from stack
      const next = stack.pop();
      if(Array.isArray(next)) {
        // push back array items, won't modify the original input
        stack.push(...next);
      } else {
        res.push(next);
      }
    }
    // reverse to restore input order
    return res.reverse();
  }

function getOnlyJSFiles(files) {
    let jsFiles = [];

    files.forEach(file => {
        if (file.endsWith(".js") || file.endsWith(".mjs")) {
            jsFiles.push(file);
        }
    })    
    
    return jsFiles;
}

function batchWrite(fileString, data, ast) {

    let split = fileString.replace(inputDirectory, '').split("\\");

    let pathBuilder = outputDirectory;
    let fixedPath;

    for (let i = 0; i < split.length; i++) {
        if (i < split.length - 1) {
            pathBuilder += "\\" + split[i];
            if (!fs.existsSync(pathBuilder)) {
                fs.mkdirSync(pathBuilder);
            }
        } else {
            fixedPath = pathBuilder + "\\\\FIXED_" + split[i];
            pathBuilder += "\\\\" + split[i];
        }
    }


    fs.writeFileSync(pathBuilder, data, (err) => {
        if (err) {
            console.log(err); 
        }
    });

    fs.writeFileSync(fixedPath, escodegen.generate(ast), (err) => {
        if (err) {
            console.log(err); 
        }
    });
}

function testWrite(ast) {
    fs.writeFileSync(".\\results\\test_fixed.mjs", escodegen.generate(ast), (err) => {
        if (err) {
            console.log(err); 
        }
    });
}


export function getBaseAST() {
    return deepCopyAST;
}

async function gitHubAction(files) {
    console.log("herro from app.mjs");
}

module.exports = gitHubAction;