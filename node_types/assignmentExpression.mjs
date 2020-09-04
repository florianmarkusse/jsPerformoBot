import { NodeType, getVariable } from './nodeType.mjs'; 
import { solveMemberExpression } from './memberExpression.mjs';
import { VariableType, getFromVariables, setToVariables } from '../types/variable.mjs';


export function handleAssignmentExpression(assignmentNode) {
    let right = getVariable(assignmentNode.right);
                
    switch (assignmentNode.left.type) {
        case NodeType.Identifier:

            let left = getFromVariables(assignmentNode.left.name);
            
            if (left.type === right.type && left.type === VariableType.literal) {
                let operator = assignmentNode.operator.slice(0, -1);
                left.value = eval(String(left.value) + operator + String(right.value));
            } else {
                setToVariables(assignmentNode.left.name, right);
            }
            break;
        case NodeType.MemberExpression:
            let result = solveMemberExpression(assignmentNode.left);
            let variable = result[0].get(result[1]);

            console.log(result);

            if (variable !== undefined && variable.type === right.type && variable.type === VariableType.literal && assignmentNode.operator !== "=") {
                let operator = assignmentNode.operator.slice(0, -1);
                variable.value = eval(String(variable.value) + operator + String(right.value));
            } else {
                result[0].set(result[1], right);
            }
            break;
    }
}