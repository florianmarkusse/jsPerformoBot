import fs from 'fs';
import espree from 'espree';
import escodegen from 'escodegen';


import { processASTNode } from './node_types/nodeType.mjs';
import { clearVariables, getVariables } from './types/variable.mjs';

fs.readFile('./example.js', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;

    processFile(content); 
});

function processFile(content) {
    const ast = espree.parse(content, { tokens: false, ecmaVersion: 11 });

    clearVariables();
    processASTNode(ast);
    
    let result = escodegen.generate(ast);
    console.log(result);


    getVariables().forEach(element => {
        console.log(element);
    });
}




