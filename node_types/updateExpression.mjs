import { unaryOperation } from '../common/stringEval.mjs';
import { getFromVariables }  from '../types/variable.mjs';

export function handleUpdateExpression(updateNode) {
    if (updateNode.prefix) {
        let variable = getFromVariables(updateNode.argument.name);
        variable.value = unaryOperation(variable.value, transformIncrementDecrementOperators(updateNode.operator))
        return variable;
    } else {
        let variable = getFromVariables(updateNode.argument.name, updateNode.operator);
        return variable;
    }
}

export function transformIncrementDecrementOperators(operator) {
    switch (operator) {
        case '++':
            return "+ 1";
        case '--':
            return "- 1";
    }
}

