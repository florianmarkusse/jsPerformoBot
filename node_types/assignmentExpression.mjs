import { NodeType, getVariable } from './nodeType.mjs'; 
import { solveMemberExpression, digUntilBase } from './memberExpression.mjs';
import { VariableType, getFromVariables, assignVariable } from '../types/variable.mjs';
import { binaryOperation } from '../common/stringEval.mjs';
import { LiteralVariable } from "../types/literalVariable.mjs";
import { handleArrayPattern } from './arrayPattern.mjs';
import { handleObjectPattern } from './objectPattern.mjs';
import { getCopyOrReference } from '../types/variable.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';


export function handleAssignmentExpression(assignmentNode) {
    let right;
    if (assignmentNode.right.type === NodeType.AssignmentExpression) {
        right = handleAssignmentExpression(assignmentNode.right);
    } else {
        right = getVariable(assignmentNode.right);
    }

    if (right === undefined) {
        console.error(assignmentNode);
        throw Error();
    }
                
    switch (assignmentNode.left.type) {
        case NodeType.ArrayPattern:
            handleArrayPattern(assignmentNode.left, false);
            return new UnknownVariable();
        case NodeType.ObjectPattern:
            handleObjectPattern(assignmentNode.left, false);
            return new UnknownVariable();
        case NodeType.Identifier:

            let left = getFromVariables(assignmentNode.left.name);

            if (left.type === right.type && left.type === VariableType.literal && assignmentNode.operator !== "=") {
                right = new LiteralVariable(binaryOperation(left.value, assignmentNode.operator.slice(0, -1), right.value));
            }
            assignVariable(assignmentNode.left.name, right);
            return getCopyOrReference(right);
        case NodeType.MemberExpression:
            let result = solveMemberExpression(assignmentNode.left);
            if (result[0].type === VariableType.unknown || 
                result[0].type === VariableType.notDefined ||
                result[0].type === VariableType.undefined) {
                return getCopyOrReference(right);
            }

            let variable = result[0].get(result[1]);

            if (variable && variable.type === right.type && variable.type === VariableType.literal && assignmentNode.operator !== "=") {
                right = new LiteralVariable(binaryOperation(variable.value, assignmentNode.operator.slice(0, -1), right.value));
            } 
                
            result[0].set(result[1], right, getNameOrConstant(assignmentNode.left.property), digUntilBase(assignmentNode.left));
            return getCopyOrReference(right);
    }
}

function getNameOrConstant(node) {
    if (node.name === undefined) {
        return node.value;
    } else {
        return node.name;
    }
}