import pkg from 'estree-walker'; 
const {walk} = pkg;

import { getFromVariables, getCopyOrReference, doPostfixOperation } from '../types/variable.mjs';
import { LiteralVariable } from '../types/literalVariable.mjs';
import { ObjectVariable } from '../types/objectVariable.mjs';
import { ArrayVariable } from '../types/arrayVariable.mjs';

import { handleVariableDeclarator} from './variableDeclarator.mjs';
import { handleAssignmentExpression } from './assignmentExpression.mjs';
import { handleForStatement } from './forStatement.mjs';
import { handleUpdateExpression } from './updateExpression.mjs';
import { solveBinaryExpressionChain } from './binaryExpression.mjs';
import { solveMemberExpression } from './memberExpression.mjs';

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
    'UpdateExpression':'UpdateExpression',
})

export function getVariable(rightNode) {
    switch (rightNode.type) {
        case NodeType.Literal:
            return new LiteralVariable(rightNode.value);
        case NodeType.Identifier:
            return getCopyOrReference(getFromVariables(rightNode.name));
        case NodeType.ObjectExpression:
            return new ObjectVariable(rightNode.properties);
        case NodeType.ArrayExpression:
            return new ArrayVariable(rightNode.elements);
        case NodeType.BinaryExpression:
            return solveBinaryExpressionChain(rightNode);
        case NodeType.MemberExpression:
            let result = solveMemberExpression(rightNode);
            return getCopyOrReference(result[0].get(result[1]));
        case NodeType.ConditionalExpression:
            return solveConditionalExpression(rightNode);
        case NodeType.UpdateExpression:
            return handleUpdateExpression(rightNode)
    }
}

export function processASTNode(ast) {
    console.log("in PROCESS AST NODE");
    walk( ast, {
        enter: function ( node, parent, prop, index ) {

            switch(node.type) {
                // New variable(s) declared.
                case NodeType.VariableDeclaration:
                    node.declarations.forEach(declaration => {
                        handleVariableDeclarator(declaration.id.name, declaration.init);
                    });
                    this.skip();
                    break;
                // New variable declared.
                case NodeType.VariableDeclarator:
                    handleVariableDeclarator(node.id.name, node.init);
                    this.skip();
                    break;
                // Variable assigned new value.
                case NodeType.AssignmentExpression:
                    handleAssignmentExpression(node);
                    this.skip();
                    break;
                // For statement.
                case NodeType.ForStatement:
                    handleForStatement(node);
                    this.skip();
                    break;
                // Sequence of expressions.
                case NodeType.SequenceExpression:
                    node.expressions.forEach(expression => {
                        handleAssignmentExpression(expression);
                    });
                    this.skip();
                    break;
                // Variable is updated.
                case NodeType.UpdateExpression:
                    let postFixOperator = handleUpdateExpression(node)[1];
                    if (postFixOperator) {
                        doPostfixOperation();
                    }
                    this.skip();
            }
        },
        leave: function ( node, parent, prop, index ) {
        }
    });
}
