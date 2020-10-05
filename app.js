import fs from 'fs';
import espree from 'espree';
import escodegen from 'escodegen';


import { processASTNode } from './node_types/nodeType.mjs';
import { clearVariablesMap, getVariables } from './types/variable.mjs';
import { getFixSet } from './fixes/fix.mjs';
import { clearFixSet } from './fixes/fix.mjs';
import { addToUnfixableSet } from './fixes/fix.mjs';
import { containsInUnfixableSet } from './fixes/fix.mjs';

let fileStringsToCheck = [];

if (String(process.argv[2]).includes(".js") || String(process.argv[2]).includes(".mjs")) { 
    fileStringsToCheck[0] = './test_files/' + String(process.argv[2]);
} else {
    // Batch mode
    let result = getAllFilesRecursively(String(process.argv[2]));
    fileStringsToCheck = getOnlyJSFiles(result);
    console.log(fileStringsToCheck);
}

fileStringsToCheck.forEach(fileString => {
    fs.readFile(fileString, function read(err, data) {
        if (err) {
            throw err;
        }
    
        let sourceType = fileString.includes(".mjs") ? "module" : "script";
        let ast = espree.parse(data, { tokens: false, ecmaVersion: 11 , sourceType: sourceType});
        
        let previousFix;
        let fixToDo;
        do {
            processAST(ast);
            let iterator = getFixSet().values();
            fixToDo = iterator.next().value;
    
            while ((previousFix !== undefined && fixToDo !== undefined && fixToDo.isEqualTo(previousFix)) || containsInUnfixableSet(fixToDo)) {
                addToUnfixableSet(fixToDo);
                fixToDo = iterator.next().value;
            } 
    
    
            if (fixToDo !== undefined) {
                fixToDo.fix(ast);
                ast = espree.parse(escodegen.generate(ast), { tokens: false, ecmaVersion: 11 });
                previousFix = fixToDo;
            }
        } while(fixToDo !== undefined/*false*/);
    
        console.log(escodegen.generate(ast));
    });
})


function processAST(ast) {

    clearGlobals();
    processASTNode(ast);
    
    
    getVariables()[0].forEach(element => {
        console.log(element);
    });
    

    /*
    getFixSet().forEach(fix => {
        console.log(fix);
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
        if (!fileNames[i].includes(".")) {
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
        if (file.includes(".js") || file.includes(".mjs")) {
            jsFiles.push(file);
        }
    })    
    
    return jsFiles;
}



