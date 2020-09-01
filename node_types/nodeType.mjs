import { variablesMap } from '../types/variable.mjs';
import { VariableType } from '../types/variable.mjs';

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
