import { NodeType, getVariable } from './nodeType.mjs'; 
import { solveMemberExpression, digUntilBase } from './memberExpression.mjs';
import { VariableType, getFromVariables, assignVariable } from '../types/variable.mjs';
import { binaryOperation } from '../common/stringEval.mjs';
import { LiteralVariable } from "../types/literalVariable.mjs";


export function handleAssignmentExpression(assignmentNode) {
    let right = getVariable(assignmentNode.right);
                
    switch (assignmentNode.left.type) {
        case NodeType.Identifier:

            let left = getFromVariables(assignmentNode.left.name);

            if (left.type === right.type && left.type === VariableType.literal && assignmentNode.operator !== "=") {
                right = new LiteralVariable(binaryOperation(left.value, assignmentNode.operator.slice(0, -1), right.value));
            }
            assignVariable(assignmentNode.left.name, right);
            break;
        case NodeType.MemberExpression:
            let result = solveMemberExpression(assignmentNode.left);
            let variable = result[0].get(result[1]);

            if (variable && variable.type === right.type && variable.type === VariableType.literal && assignmentNode.operator !== "=") {
                right = new LiteralVariable(binaryOperation(variable.value, assignmentNode.operator.slice(0, -1), right.value));
            } 
                
            result[0].set(result[1], right, getNameOrConstant(assignmentNode.left.property), digUntilBase(assignmentNode.left));
            
            break;
    }
}

function getNameOrConstant(node) {
    if (node.name === undefined) {
        return node.value;
    } else {
        return node.name;
    }
}