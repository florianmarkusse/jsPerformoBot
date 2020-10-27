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

if (String(process.argv[2]).endsWith(".js") || String(process.argv[2]).endsWith(".mjs")) { 
    fileStringsToCheck[0] = './test_files/' + String(process.argv[2]);
} else {
    // Batch mode
    let result = getAllFilesRecursively(String(process.argv[2]));
    fileStringsToCheck = getOnlyJSFiles(result);
    if (process.argv[3]) {
        fileStringsToCheck.splice(0, fileStringsToCheck.indexOf(process.argv[3]));
    }
}

for (let i = 0; i < fileStringsToCheck.length; i++) {
    const fileString = fileStringsToCheck[i];
    let newFilePath = "D:\\incorrectFiles2\\";
    let filename = fileString.replace("D:\\testositories2\\", '')


    let finalDot = filename.indexOf(".", 10);
    let firstPart = filename.substring(0, finalDot)
    let secondPart = filename.substring(finalDot);

    firstPart += "_FIXED";
    let fixedFileString = newFilePath + firstPart + secondPart;
    let newFileString = newFilePath + fileString.replace("D:\\testositories2\\", '');


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
        do {
            // The processing happens here
            processAST(ast);
            //


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
                }
                ast = espree.parse(escodegen.generate(ast), { tokens: false, ecmaVersion: 11 , sourceType: "module"});
                previousFix = fixToDo;
            }
        } while(fixToDo !== undefined/*false*/);
    
        if (foundFix) {
            console.log(`Fixed a performance issue in ${fileString}\n`);
            filesFixed.push(fileString);

            let split = fileString.replace("D:\\testositories2\\", '').split("\\");
            let pathBuilder = "D:\\incorrectFiles2";
            for (let i = 0; i < split.length - 1; i++) {
                pathBuilder += "\\" + split[i];
                if (!fs.existsSync(pathBuilder)) {
                    fs.mkdirSync(pathBuilder);
                }
            }
            /*
            fs.writeFileSync(newFileString, data, (err) => {
                if (err) {
                    console.log(err); 
                }
            });

            fs.writeFileSync(fixedFileString, escodegen.generate(ast), (err) => {
                if (err) {
                    console.log(err); 
                }
            });
            */

           fs.writeFileSync(".\\results\\test_fixed.mjs", escodegen.generate(ast), (err) => {
            if (err) {
                console.log(err); 
            }
        });
        } else {
            console.log(`Did not find any performance issues in ${fileString}`);
        }
}

console.log(`Fixed ${filesFixed.length} issues.`);
console.log(`In the following files:`);
for (let i = 0; i < filesFixed.length; i++) {
    console.log(`${filesFixed[i]}`);
}

function processAST(ast) {

    clearGlobals();
    processASTNode(ast);
    
    
    /*
    getVariables()[0].forEach(element => {
        console.log(element);
    });
    */
    
    

    
    
    getFixSet().forEach(fix => {
        console.log(fix);
        console.log(fix.nodeToChange);
    })
    
    
    
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


export function getBaseAST() {
    return deepCopyAST;
}