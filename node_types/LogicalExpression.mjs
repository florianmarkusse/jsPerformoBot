import { createLiteralNode } from "../ast_utilities/nodes.mjs";
import { binaryOperation } from "../common/stringEval.mjs";
import { NodeType, getVariable } from "./nodeType.mjs";
import { UnknownVariable } from '../types/unknownVariable.mjs';
import { createCorrectNodeBasedOnValue } from "../ast_utilities/nodes.mjs";
import { VariableType } from '../types/variable.mjs';
import { logicalBinaryOperation } from "../common/stringEval.mjs";
import { addToFixSet } from "../fixes/fix.mjs";
import { BinaryUndefined } from "../fixes/binaryUndefined.mjs";
import { getParent } from "../ast_utilities/astTraversal.mjs";
import { getBaseAST } from "../app.mjs";


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

    let result = logicalBinaryOperation(leftValue, baseNode.operator, rightValue);

    // ONLY IF NOT IN LOOP

    let parentNode = getOuterLoop(baseNode);

    if (parentNode === undefined ||
        parentNode.type === NodeType.ForStatement ||
        parentNode.type === NodeType.WhileStatement ||
        parentNode.type === NodeType.DoWhileStatement) {
            return result;
        }
    switch (baseNode.operator) {
        case '&&':
            if (leftValue.type === VariableType.NaN ||
                leftValue.type === VariableType.undefined ||
                leftValue.type === VariableType.literal && Boolean(leftValue.value)) {
                    addToFixSet(new BinaryUndefined(true, false, baseNode, result));
                }
            break;
        case '||':
            if (leftValue.type === VariableType.NaN ||
                leftValue.type === VariableType.undefined ||
                leftValue.type === VariableType.literal && Boolean(leftValue.value)) {
                    addToFixSet(new BinaryUndefined(false, true, baseNode, result));
                }
            break;
    }

    
 
    return result;
}

function getOuterLoop(node) {
    if (node && (
        node.type !== NodeType.ForStatement &&
        node.type !== NodeType.WhileStatement &&
        node.type !== NodeType.DoWhileStatement &&
        node.type !== NodeType.Program)
     ) {
            return getOuterLoop(getParent(getBaseAST(), node))
        } else {
            return node;
        }
}