import { NodeType } from './nodeType.mjs'; 
import { getVariable } from './nodeType.mjs';

export function solveBinaryExpressionChain(baseNode) {

    let leftValue;
    let rightValue;

    if (baseNode.left.type === NodeType.BinaryExpression) {
        leftValue = solveBinaryExpressionChain(baseNode.left);
        rightValue = getVariable(baseNode.right);
    } else if (baseNode.right.type === NodeType.BinaryExpression) {
        rightValue = solveBinaryExpressionChain(baseNode.left);
        leftValue = getVariable(baseNode.right);
    } else {
        leftValue = getVariable(baseNode.left);
        rightValue = getVariable(baseNode.right);
    }

    if (leftValue.value === undefined || rightValue.value === undefined) {
        return new UnknownVariable();
    }

    leftValue.value = eval(String(leftValue.value) + baseNode.operator + String(rightValue.value)); 

    return leftValue;
}



