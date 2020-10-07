import lodash from 'lodash';

import { getFromVariables } from '../types/variable.mjs';
import { LiteralVariable } from '../types/literalVariable.mjs';
import { ObjectVariable } from '../types/objectVariable.mjs';
import { ArrayVariable } from '../types/arrayVariable.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';

import { handleAssignmentExpression } from './assignmentExpression.mjs';
import { solveBinaryExpressionChain } from './binaryExpression.mjs';
import { solveMemberExpression } from './memberExpression.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';
import { solveLogicalExpressionChain } from './LogicalExpression.mjs';
import { handleUnaryExpression } from './unaryExpression.mjs';
import { handleFunctionDeclaration } from './functionDeclaration.mjs';
import { handleCallExpression } from './callExpression.mjs';
import { solveConditionalExpression } from './conditionalExpression.mjs';
import { VariableType } from '../types/variable.mjs';
import { postUnaryOperation } from '../common/stringEval.mjs';
import { NodeType } from './nodeType.mjs';

export function handleUpdateExpression(updateNode) {

    let variable = getReferenceToVariable(updateNode.argument);

    if (variable.type === VariableType.literal) {
        if (updateNode.prefix) {
            variable.value = postUnaryOperation(variable.value, transformIncrementDecrementOperators(updateNode.operator));
            return lodash.cloneDeep(variable);
        } else {
            let copy = lodash.cloneDeep(variable);
            variable.value = postUnaryOperation(variable.value, transformIncrementDecrementOperators(updateNode.operator));
            return copy;
        }
    } else {
        return variable;
    }
}

export function transformIncrementDecrementOperators(operator) {
    switch (operator) {
        case '++':
            return "+ 1";
        case '--':
            return "- 1";
    }
}

function getReferenceToVariable(node) {
    if (node === null) {
        return new UndefinedVariable();
    }
    switch (node.type) {
        case NodeType.Literal:
            return new LiteralVariable(node.value);
        case NodeType.Identifier:
            return getFromVariables(node.name);
        case NodeType.ObjectExpression:
            return new ObjectVariable(node.properties);
        case NodeType.ArrayExpression:
            return new ArrayVariable(node.elements);
        case NodeType.BinaryExpression:
            return solveBinaryExpressionChain(node);
        case NodeType.MemberExpression:
            let result = solveMemberExpression(node);
            if (typeof result[0].getWithNode === 'function') {
                return (result[0].getWithNode(result[1], node));
            }
            return (result[0]);
        case NodeType.ConditionalExpression:
            return solveConditionalExpression(node);
        case NodeType.UpdateExpression:
            return handleUpdateExpression(node);
        case NodeType.UnaryExpression:
            return handleUnaryExpression(node);
        case NodeType.CallExpression:
            return handleCallExpression(node);
        case NodeType.LogicalExpression:
            return solveLogicalExpressionChain(node);
        case NodeType.ThisExpression:
            return getFromVariables("this");
        case NodeType.SuperExpression:
            return getFromVariables("super");
        case NodeType.FunctionDeclaration:
        case NodeType.FunctionExpression:
        case NodeType.ArrowFunctionExpression:
            return handleFunctionDeclaration(node);
        case NodeType.AssignmentExpression:
            return handleAssignmentExpression(node);
        case NodeType.NewExpression:
            return new UnknownVariable();
        default:
            console.error("GetVariable with node type not handled");
            throw Error();
    }
}

