import { createLiteralNode } from "../ast_utilities/nodes.mjs";
import { binaryOperation } from "../common/stringEval.mjs";
import { solveBinaryExpressionChain } from "./binaryExpression.mjs";
import { NodeType } from "./nodeType.mjs";


export function solveLogicalExpressionChain(baseNode) {
    
    let leftValue;
    let rightValue;

    if (baseNode.left.type === NodeType.LogicalExpression) {
        leftValue = solveLogicalExpressionChain(baseNode.left);
    } else {
        leftValue = solveBinaryExpressionChain(baseNode.left);
    }

    if (baseNode.right.type === NodeType.logicalExpression) {
        rightValue = solveLogicalExpressionChain(baseNode.right);
    } else {
        rightValue = solveBinaryExpressionChain(baseNode.right);
    }

    let logicalResult = binaryOperation(leftValue.value, baseNode.operator, rightValue.value);
    return createLiteralNode(logicalResult);
}