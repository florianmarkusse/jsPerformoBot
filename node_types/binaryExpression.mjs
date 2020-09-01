import { NodeType, getVariableFromLiteralOrIdentifierNode } from './nodeType.mjs'; 

export function solveBinaryExpressionChain(baseNode) {
    if (baseNode.left.type === NodeType.BinaryExpression) {
        let leftResult = solveBinaryExpressionChain(baseNode.left);

        let rightResult = getVariableFromLiteralOrIdentifierNode(baseNode.right);
        if (rightResult === undefined) {
            return;
        }

        return eval(String(leftResult) + baseNode.operator + String(rightResult));
    } else if (baseNode.right.type === NodeType.BinaryExpression) {
        let rightResult = solveBinaryExpressionChain(baseNode.right);

        let leftResult = getVariableFromLiteralOrIdentifierNode(baseNode.left);
        if (leftResult === undefined) {
            return;
        }

        return eval(String(rightResult) + baseNode.operator + String(leftResult));
    } else {

        let leftValue = getVariableFromLiteralOrIdentifierNode(baseNode.left);
        if (leftValue === undefined) {
            return;
        }

        let rightValue = getVariableFromLiteralOrIdentifierNode(baseNode.right);
        if (rightValue === undefined) {
            return;
        }

        return eval(String(leftValue) + baseNode.operator + String(rightValue));
    }
}



