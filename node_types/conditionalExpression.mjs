import { getVariable } from './nodeType.mjs';

export function solveConditionalExpression(conditionNode) {
    let testResult = Boolean(getVariable(conditionNode.test).value);

    if (testResult) {
        return getVariable(conditionNode.consequent);
    } else {
        return getVariable(conditionNode.alternate);
    }
}