import fs from 'fs';
import espree from 'espree';
import escodegen from 'escodegen';


import { processASTNode } from './node_types/nodeType.mjs';
import { clearVariablesMap, getVariables } from './types/variable.mjs';
import { getFixSet } from './fixes/fix.mjs';
import { clearFixSet } from './fixes/fix.mjs';

fs.readFile('./example.js', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;

    let ast = processFile(content);
    let iterator = getFixSet().values();
    let fixToDo = iterator.next().value;
    console.log(fixToDo);
    if (fixToDo !== undefined) {
        fixToDo.fix(ast);
    }

    /*
    let fixToDo;
    do {
        let ast = processFile(content);
        let iterator = getFixSet().values();
        fixToDo = iterator.next().value;
        console.log(fixToDo);
        if (fixToDo !== undefined) {
            fixToDo.fix(ast);
        }
    } while(fixToDo !== undefined);
    */
});

function processFile(content) {
    const ast = espree.parse(content, { tokens: false, ecmaVersion: 11 });

    clearGlobals();
    processASTNode(ast);
    /*    
    getVariables().forEach(element => {
        console.log(element);
    });

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



