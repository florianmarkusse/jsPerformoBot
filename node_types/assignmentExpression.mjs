import { getCopyOrReference } from './variableDeclarator.mjs';
import { NodeType } from './nodeType.mjs'; 
import { solveMemberExpression } from './memberExpression.mjs';
import { VariableType, variablesMap } from '../types/variable.mjs';
import { ContiguityResult } from '../types/arrayVariable.mjs';
import { contiguityWarning } from '../warnings/arrayContiguityWarning.mjs';

import { ArrayVariable } from '../types/arrayVariable.mjs';
import { LiteralVariable } from '../types/literalVariable.mjs';
import { ObjectVariable } from '../types/objectVariable.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';
import { solveBinaryExpressionChain } from './binaryExpression.mjs';
import { solveConditionalExpression } from './conditionalExpression.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';

export function handleAssignmentExpression(assignmentNode) {
    let right = getVariable(assignmentNode.right);
                
    switch (assignmentNode.left.type) {
        case NodeType.Identifier:

            let left = variablesMap.get(assignmentNode.left.name);
            
            if (left.type === right.type && left.type === VariableType.literal) {
                let operator = assignmentNode.operator.slice(0, -1);
                left.value = eval(String(left.value) + operator + String(right.value));
            } else {
                variablesMap.set(assignmentNode.left.name, right);
            }
            break;
        case NodeType.MemberExpression:
            let result = solveMemberExpression(assignmentNode.left);
            let variable = result[0].get(result[1]);

            if (variable !== undefined && variable.type === right.type && variable.type === VariableType.literal && assignmentNode.operator !== "=") {
                let operator = assignmentNode.operator.slice(0, -1);
                variable.value = eval(String(variable.value) + operator + String(right.value));
            } else {
                result[0].set(result[1], right);
            }
            break;
    }
    return false;
}

export function getVariable(rightNode) {
    console.log(rightNode);
    switch (rightNode.type) {

        case NodeType.Literal:
            return new LiteralVariable(rightNode.value);
        case NodeType.Identifier:
            return getCopyOrReference(variablesMap.get(rightNode.name));
        case NodeType.ObjectExpression:
            return new ObjectVariable(rightNode.properties);
            // TODO: MEMBEREXPRESSION
        case NodeType.MemberExpression:
            let result = solveMemberExpression(rightNode);
    }
}