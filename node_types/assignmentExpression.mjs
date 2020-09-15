import { NodeType, getVariable } from './nodeType.mjs'; 
import { solveMemberExpression, digUntilBase } from './memberExpression.mjs';
import { VariableType, getFromVariables, setToVariables } from '../types/variable.mjs';
import { binaryOperation } from '../common/stringEval.mjs';


export function handleAssignmentExpression(assignmentNode) {
    let right = getVariable(assignmentNode.right);
                
    switch (assignmentNode.left.type) {
        case NodeType.Identifier:

            let left = getFromVariables(assignmentNode.left.name);
            
            if (left.type === right.type && left.type === VariableType.literal && assignmentNode.operator !== "=") {
                left.value = binaryOperation(left.value, assignmentNode.operator.slice(0, -1), right.value);
            } else {
                setToVariables(assignmentNode.left.name, right);
            }
            break;
        case NodeType.MemberExpression:
            let result = solveMemberExpression(assignmentNode.left);
            let variable = result[0].get(result[1]);

            if (variable !== undefined && variable.type === right.type && variable.type === VariableType.literal && assignmentNode.operator !== "=") {
                variable.value = binaryOperation(variable.value, assignmentNode.operator.slice(0, -1), right.value);
            } else {
                result[0].set(result[1], right, getNameOrConstant(assignmentNode.left.property), digUntilBase(assignmentNode.left));
            }
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