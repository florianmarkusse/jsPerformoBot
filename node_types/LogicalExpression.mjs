import { createLiteralNode } from "../ast_utilities/nodes.mjs";
import { binaryOperation } from "../common/stringEval.mjs";
import { NodeType, getVariable } from "./nodeType.mjs";
import { UnknownVariable } from '../types/unknownVariable.mjs';
import { createCorrectNodeBasedOnValue } from "../ast_utilities/nodes.mjs";
import { VariableType } from '../types/variable.mjs';


export function solveLogicalExpressionChain(baseNode) {
    
    let leftValue;
    let rightValue;

    if (baseNode.left.type === NodeType.LogicalExpression) {
        leftValue = solveLogicalExpressionChain(baseNode.left);
    } else {
        leftValue = getVariable(baseNode.left);
    }

    if (baseNode.right.type === NodeType.LogicalExpression) {
        rightValue = solveLogicalExpressionChain(baseNode.right);
    } else {
        rightValue = getVariable(baseNode.right);
    }
 
    if (leftValue.type === VariableType.unknown || rightValue.type === VariableType.unknown) {
        return new UnknownVariable();
    } else {
        let logicalResult = binaryOperation(leftValue.value, baseNode.operator, rightValue.value);
        return getVariable(createCorrectNodeBasedOnValue(logicalResult));
    }
}