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
import { handleTryStatement } from './tryStatement.mjs';
import { handleImportDeclaration } from './importDeclaration.mjs';
import { handleFunctionDeclaration } from './functionDeclaration.mjs';
import { handleClassDeclaration } from './classDeclaration.mjs';
import { handleCallExpression } from './callExpression.mjs';
import { solveConditionalExpression } from './conditionalExpression.mjs';
import { VariableType } from '../types/variable.mjs';
import { handleArrayPattern } from './arrayPattern.mjs';

import { TimeOutError } from '../error/timeoutError.mjs';
import { handleForInStatement } from './forInStatement.mjs';

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
    'TryStatement':'TryStatement',
    "ImportDeclaration":"ImportDeclaration",
    'FunctionDeclaration':'FunctionDeclaration',
    'ClassDeclaration':'ClassDeclaration',
    'ThisExpression':'ThisExpression',
    'SuperExpression':'SuperExpression',
    'FunctionExpression':'FunctionExpression',
    'ArrayPattern':'ArrayPattern',
    'ObjectPattern':'ObjectPattern',
    'ArrowFunctionExpression':'ArrowFunctionExpression',
    'NewExpression':'NewExpression',
    'TemplateLiteral':'TemplateLiteral',
    'Program':'Program',
    'ForInStatement':'ForInStatement',
    'ForOfStatement':'ForOfStatement',
    'SpreadElement':'SpreadElement',
    'AwaitExpression':'AwaitExpression',
    'ClassExpression':'ClassExpression',
    'TaggedTemplateExpression':'TaggedTemplateExpression',
    'MethodDefinition':'MethodDefinition',
    'YieldExpression':'YieldExpression',
    'ChainExpression':'ChainExpression',
    'ImportExpression':'ImportExpression',
    'MetaProperty':'MetaProperty',
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
            if (typeof result[0].getWithNode === 'function') {
                return getCopyOrReference(result[0].getWithNode(result[1], rightNode));
            }
            return getCopyOrReference(result[0]);
        case NodeType.ConditionalExpression:
            return solveConditionalExpression(rightNode);
        case NodeType.UpdateExpression:
            return getCopyOrReference(handleUpdateExpression(rightNode));
        case NodeType.UnaryExpression:
            return handleUnaryExpression(rightNode);
        case NodeType.CallExpression:
            return handleCallExpression(rightNode);
        case NodeType.LogicalExpression:
            return solveLogicalExpressionChain(rightNode);
        case NodeType.ThisExpression:
            return getCopyOrReference(getFromVariables("this"));
        case NodeType.SuperExpression:
            return getCopyOrReference(getFromVariables("super"));
        case NodeType.FunctionDeclaration:
        case NodeType.FunctionExpression:
        case NodeType.ArrowFunctionExpression:
            return handleFunctionDeclaration(rightNode);
        case NodeType.AssignmentExpression:
            return handleAssignmentExpression(rightNode);
        case NodeType.SequenceExpression:
            rightNode.expressions.forEach(expression => {
                processASTNode(expression);
            });
            return new UnknownVariable();
        case NodeType.ClassExpression:
        case NodeType.TaggedTemplateExpression:
        case NodeType.YieldExpression:
            processASTNode(rightNode);
            return new UnknownVariable();
        case NodeType.TemplateLiteral:
        case NodeType.NewExpression:
        case NodeType.SpreadElement:
        case NodeType.AwaitExpression:
        case NodeType.ChainExpression:
        case NodeType.ImportExpression:
        case NodeType.MetaProperty:
            return new UnknownVariable();
        default:
            console.error("GetVariable with node type not handled");
            console.log(rightNode);
            throw Error();
    }
}

export function processASTNode(ast) {
            walk( ast, {
                enter: function ( node, parent, prop, index ) {
                    /*
                    let currentDate = new Date();
                    console.log(currentDate - startDate);
                    */
                    switch(node.type) {
                        // New variable(s) declared.
                        case NodeType.VariableDeclaration:
                            node.declarations.forEach(declaration => {
                                handleVariableDeclarator(declaration);
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
                        // For in/of statement.
                        case NodeType.ForInStatement:
                        case NodeType.ForOfStatement:
                            handleForInStatement(node);
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
                        case NodeType.SequenceExpression:
                            node.expressions.forEach(expression => {
                                processASTNode(expression);
                            });
                            this.skip();
                            break;
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
                        // Switch statement.
                        case NodeType.SwitchStatement:
                            handleSwitchStatement(node);
                            this.skip();
                            break;
                        // Try-statement.
                        case NodeType.TryStatement:
                            handleTryStatement(node);
                            this.skip();
                            break;
                        // Module import.
                        case NodeType.ImportDeclaration:
                            handleImportDeclaration(node);
                            this.skip();
                            break;
                        // Function declaration.
                        case NodeType.FunctionDeclaration:
                            handleFunctionDeclaration(node);
                            this.skip();
                            break;
                        // Function expression.
                        case NodeType.FunctionExpression:
                            handleFunctionDeclaration(node);
                            this.skip();
                            break;
                        // Arrow Function expression:
                        case NodeType.ArrowFunctionExpression:
                            handleFunctionDeclaration(node);
                            this.skip();
                            break;
                        // Class declaration.
                        case NodeType.ClassDeclaration:
                            handleClassDeclaration(node);
                            this.skip();
                            break;
                        // Call expression.
                        case NodeType.CallExpression:
                            handleCallExpression(node);
                            this.skip();
                            break;
                        // Array pattern.
                        case NodeType.ArrayPattern:
                            handleArrayPattern(node);
                            this.skip();
                            break;
                    }
                },
                leave: function ( node, parent, prop, index ) {
                }
            });
}

export function processSingleASTNode(node) {

    if (node === null) {
        return new UnknownVariable();
    }

    switch(node.type) {
        case NodeType.LogicalExpression:
            return solveLogicalExpressionChain(node);
        case NodeType.BinaryExpression:
            return solveBinaryExpressionChain(node);
        case NodeType.Literal:
        case NodeType.Identifier:
        case NodeType.UpdateExpression:
            return getVariable(node);
        case NodeType.AssignmentExpression:
            return handleAssignmentExpression(node);
        case NodeType.UnaryExpression:
            return handleUnaryExpression(node);
        case NodeType.CallExpression:
            return handleCallExpression(node);
        case NodeType.SequenceExpression:
            node.expressions.forEach(expression => {
                processASTNode(expression);
            });
            return new UnknownVariable();
        case NodeType.MemberExpression:
            let result = solveMemberExpression(node);
            if (typeof result[0].get === 'function') {
                return getCopyOrReference(result[0].get(result[1]));
            }
            return getCopyOrReference(result[0]);
        default:
            console.error("process SIngle AST node unknown node type")
            console.error(node);
            throw Error();
    }
}

