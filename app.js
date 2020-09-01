import fs from 'fs';
import espree from 'espree';
import pkg from 'estree-walker'; 
const {walk} = pkg;

import { NodeType } from './node_types/nodeType.mjs';
import { variablesMap, VariableType } from './types/variable.mjs';
import { handleVariableDeclarator } from './node_types/variableDeclarator.mjs';
import { solveMemberExpression } from './node_types/memberExpression.mjs';
import { UnknownVariable } from './types/unknownVariable.mjs';
import { MemberExpression } from 'espree/lib/ast-node-types';

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

                switch (node.left) {
                    case NodeType.Identifier:
                        console.log("hi");
                        break;
                    case NodeType.Literal:
                        break;
                    case NodeType.MemberExpression:
                        let result = solveMemberExpression(node.left);
                        switch (result[0].type) {
                            case VariableType.object:
                                result[0].propertiesMap.set(result[1], handleVariableDeclarator(node.right));
                                break;
                            case VariableType.array:
                                result[0].setElement(parseInt(result[1]), handleVariableDeclarator(node.right));
                                break;
                        }
                        break;
                }
                    
            }

            /*
            if (node.type === NodeType.AssignmentExpression && variablesMap.has(node.left.object.name)) {
                const variable = variablesMap.get(node.left.object.name);


                
                if (variable.type === ArrayVariable.type) {
                    if (variable.updateArrayVariable(node.left.property.value, node.right.value)) {
                        console.log(node);
                        console.log("is the root of the perforamnce bug.");
                    }
                }


                
            }
            */
        },
        leave: function ( node, parent, prop, index ) {
            // some code happens
        }
    });

    variablesMap.forEach(element => {
        console.log(element.propertiesMap.get('y').propertiesMap.get('z'));
    });
}




