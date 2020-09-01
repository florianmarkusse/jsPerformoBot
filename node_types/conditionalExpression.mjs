import { NodeType, getVariableFromLiteralOrIdentifierNode } from './nodeType.mjs'; 
import { solveBinaryExpressionChain } from '../node_types/binaryExpression.mjs';

export function solveConditionalExpression(conditionNode) {
    let testResult;
    if (conditionNode.test.type === NodeType.BinaryExpression) {
        testResult = solveBinaryExpressionChain(conditionNode.test);
    } else {
        let result = getVariableFromLiteralOrIdentifierNode(conditionNode.test);

        if (result === undefined) {
            return;
        }

        testResult = Boolean(result);
    }

    if (testResult) {
        if (conditionNode.consequent.type === NodeType.ConditionalExpression) {
            return solveConditionalExpression(conditionNode.consequent);
        } else {
            return conditionNode.consequent;
        }
    } else {
        if (conditionNode.alternate.type === NodeType.ConditionalExpression) {
            return solveConditionalExpression(conditionNode.alternate);
        } else {
            return conditionNode.alternate;
        }
    }
}