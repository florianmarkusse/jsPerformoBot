import pkg from 'estree-walker'; 
const {walk} = pkg;

import { variablesMap, VariableType } from '../types/variable.mjs';
import { handleVariableDeclarator} from './variableDeclarator.mjs';
import { handleAssignmentExpression } from './assignmentExpression.mjs';
import { handleForStatement } from './forStatement.mjs';

export const NodeType = Object.freeze({
    'ArrayExpression': 'ArrayExpression',
    'AssignmentExpression': 'AssignmentExpression',
    'VariableDeclarator' : 'VariableDeclarator',
    'Literal' : 'Literal',
    'Identifier' : 'Identifier',
    'ObjectExpression' : 'ObjectExpression',
    'CallExpression' : 'CallExpression',
    'BinaryExpression' : 'BinaryExpression',
    'ConditionalExpression':'ConditionalExpression',
    'MemberExpression':'MemberExpression',
    'ForStatement':'ForStatement',
    'VariableDeclaration':'VariableDeclaration',
    'SequenceExpression':'SequenceExpression',
})

export function getVariableFromLiteralOrIdentifierNode(node) {
    if (node.type === NodeType.Identifier) {
        if (!variablesMap.has(node.name)) {
            console.error("Variable is not registered!");
        }

        console.log(`Getting name ${node.name}`);
        let variable = variablesMap.get(node.name);

        if (variable.type === VariableType.unknown) {
            return;
        } else {
            return variable.value;
        }
    } else {
        return node.value;
    }
}

export function getValueFromLiteralOrIdentifierNode(node) {
    if (node.type === NodeType.Identifier) {
        return node.name;
    } else {
        return node.value;
    }
}

export function processASTNode(ast) {
    console.log("in PROCESS AST NODE");
    walk( ast, {
        enter: function ( node, parent, prop, index ) {
            // New variable declared.
            if (node.type === NodeType.VariableDeclarator) {
                    handleVariableDeclarator(node.id.name, node.init);
                this.skip();
            }
            
            // Variable assigned new value.
            if (node.type === NodeType.AssignmentExpression) {
                if (handleAssignmentExpression(node)) {
                    madeFix = true;
                }   
                this.skip();
            }

            if (node.type === NodeType.ForStatement) {
                handleForStatement(node);
                this.skip();
            }
        },
        leave: function ( node, parent, prop, index ) {
        }
    });
}
