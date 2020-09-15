import fs from 'fs';
import espree from 'espree';
import escodegen from 'escodegen';


import { processASTNode } from './node_types/nodeType.mjs';
import { clearVariablesMap, getVariables } from './types/variable.mjs';
import { getFixSet } from './fixes/fix.mjs';
import { clearFixSet } from './fixes/fix.mjs';

const fileString = './test_files/' + String(process.argv[2]);

fs.readFile(fileString, function read(err, data) {
    if (err) {
        throw err;
    }

    let ast = espree.parse(data, { tokens: false, ecmaVersion: 11 });
    
    let fixToDo;
    do {
        processAST(ast);
        let iterator = getFixSet().values();
        fixToDo = iterator.next().value;
        if (fixToDo !== undefined) {
            fixToDo.fix(ast);
            
        }
    } while(fixToDo !== undefined);

    console.log(escodegen.generate(ast));
    
});

function processAST(ast) {

    clearGlobals();
    processASTNode(ast);
    
    /*
    getVariables().forEach(element => {
        console.log(element);
    });
    */

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



