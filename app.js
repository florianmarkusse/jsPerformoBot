import fs from 'fs';
import espree from 'espree';
import pkg from 'estree-walker'; 
const {walk} = pkg;

import { NodeType } from './node_types/nodeType.mjs';
import { variablesMap } from './types/variable.mjs';
import { handleVariableDeclarator } from './node_types/variableDeclarator.mjs';
import { handleAssignmentExpression } from './node_types/assignmentExpression.mjs';

fs.readFile('./example.js', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;

    processFile(content); 
});

function processFile(content) {
    const ast = espree.parse(content, { tokens: false, ecmaVersion: 11 });
    
    
    walk( ast, {
        enter: function ( node, parent, prop, index ) {
            // New variable declared.
            if (node.type === NodeType.VariableDeclarator) {
                let variable = handleVariableDeclarator(node.init);
                variablesMap.set(node.id.name, variable);
            }
            
            // Variable assigned new value.
            if (node.type === NodeType.AssignmentExpression) {
                handleAssignmentExpression(node);
            }
        },
        leave: function ( node, parent, prop, index ) {
            // some code happens
        }
    });

    variablesMap.forEach(element => {
        console.log(element);
    });
}




