import pkg from 'estree-walker'; 
const {walk} = pkg;

import { getFromVariables, getCopyOrReference } from '../types/variable.mjs';
import { LiteralVariable } from '../types/literalVariable.mjs';
import { ObjectVariable } from '../types/objectVariable.mjs';
import { ArrayVariable } from '../types/arrayVariable.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';

import { handleVariableDeclarator} from './variableDeclarator.mjs';
import { handleAssignmentExpression } from './assignmentExpression.mjs';
import { handleForStatement } from './forStatement.mjs';
import { handleUpdateExpression } from './updateExpression.mjs';
import { solveBinaryExpressionChain } from './binaryExpression.mjs';
import { solveMemberExpression } from './memberExpression.mjs';
import { handleWhileStatement } from './whileStatement.mjs';
import { handleDoWhileStatement } from './doWhileStatement.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';
import { solveLogicalExpressionChain } from './LogicalExpression.mjs';
import { handleBlockStatement } from './blockStatement.mjs';
import { handleUnaryExpression } from './unaryExpression.mjs';
import { handleIfStatement } from './ifStatement.mjs';
import { handleSwitchStatement } from './switchStatement.mjs';

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
    'WhileStatement':'WhileStatement',
    'DoWhileStatement':'DoWhileStatement',
    'BlockStatement':'BlockStatement',
    'CallExpression':'CallExpression',
    'LogicalExpression':'LogicalExpression',
    'ExpressionStatement':'ExpressionStatement',
    'UnaryExpression':'UnaryExpression',
    'IfStatement':'IfStatement',
    'SwitchStatement':'SwitchStatement',
    'BreakStatement':'BreakStatement',
})

export function getVariable(rightNode) {
    if (rightNode === null) {
        return new UndefinedVariable();
    }
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
            return getCopyOrReference(result[0].getWithNode(result[1], rightNode));
        case NodeType.ConditionalExpression:
            return solveConditionalExpression(rightNode);
        case NodeType.UpdateExpression:
            return getCopyOrReference(handleUpdateExpression(rightNode));
        case NodeType.UnaryExpression:
            return handleUnaryExpression(rightNode);
        case NodeType.CallExpression:
            return new UnknownVariable();
    }
}

export function processASTNode(ast) {
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
                // While statement.
                case NodeType.WhileStatement:
                    handleWhileStatement(node);
                    this.skip();
                    break;
                // Do while statement.
                case NodeType.DoWhileStatement:
                    handleDoWhileStatement(node);
                    this.skip();
                    break;
                // Sequence of expressions.
                /*
                case NodeType.SequenceExpression:
                    node.expressions.forEach(expression => {
                        processASTNode(expression);
                    });
                    this.skip();
                    break;
                */
                // Variable is updated.
                case NodeType.UpdateExpression:
                    handleUpdateExpression(node);
                    this.skip()
                    break;
                // Block statement.
                case NodeType.BlockStatement:
                    handleBlockStatement(node);
                    this.skip();
                    break;
                // Unary statement.
                case NodeType.UnaryExpression:
                    handleUnaryExpression(node);
                    this.skip();
                    break;
                // If statement.
                case NodeType.IfStatement:
                    handleIfStatement(node);
                    this.skip();
                    break;
                // Break statement.
                case NodeType.BreakStatement:
                    return;
                // Switch statement.
                case NodeType.SwitchStatement:
                    handleSwitchStatement(node);
                    this.skip();
                    break;
            }
        },
        leave: function ( node, parent, prop, index ) {
        }
    });
}

export function processSingleASTNode(node) {
    switch(node.type) {
        case NodeType.LogicalExpression:
            return solveLogicalExpressionChain(node);
        case NodeType.BinaryExpression:
            return solveBinaryExpressionChain(node);
        case NodeType.Literal:
        case NodeType.Identifier:
            return getVariable(node);

    }
}

