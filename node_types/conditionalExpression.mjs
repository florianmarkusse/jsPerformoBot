import { UnknownVariable } from '../types/unknownVariable.mjs';
import { processASTNode } from './nodeType.mjs';
import { getVariable } from './nodeType.mjs';

export function solveConditionalExpression(conditionNode) {
    processASTNode(conditionNode.test);

    return new UnknownVariable();
}