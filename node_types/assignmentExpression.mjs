import { handleVariableDeclarator } from './variableDeclarator.mjs';
import { NodeType } from './nodeType.mjs'; 
import { solveMemberExpression } from './memberExpression.mjs';
import { VariableType, variablesMap } from '../types/variable.mjs';

export function handleAssignmentExpression(assignmentNode) {
    let right = handleVariableDeclarator(assignmentNode.right);
                
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
            switch (result[0].type) {
                case VariableType.object: {

                    let variable = result[0].propertiesMap.get(result[1]);

                    if (variable.type === right.type && variable.type === VariableType.literal) {
                        let operator = assignmentNode.operator.slice(0, -1);
                        variable.value = eval(String(variable.value) + operator + String(right.value));
                    } else {
                        result[0].propertiesMap.set(result[1], right);
                    }
                    break;
                }
                case VariableType.array: {

                    let variable = result[0].getElement(result[1]);

                    if (variable.type === right.type && variable.type === VariableType.literal) {
                        let operator = assignmentNode.operator.slice(0, -1);
                        variable.value = eval(String(variable.value) + operator + String(right.value));
                    } else {
                        result[0].setElement(parseInt(result[1]), right);
                    }
                    break;
                }
            }
            break;
    }
}