import fs from 'fs';
import espree from 'espree';
import escodegen from 'escodegen';


import { processASTNode } from './node_types/nodeType.mjs';
import { variablesMap } from './types/variable.mjs';

fs.readFile('./example.js', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;

    processFile(content); 
});

function processFile(content) {
    const ast = espree.parse(content, { tokens: false, ecmaVersion: 11 });

    variablesMap.clear();
    processASTNode(ast);
    
    let result = escodegen.generate(ast);
    console.log(result);


    variablesMap.forEach(element => {
        console.log(element);
    });
}




