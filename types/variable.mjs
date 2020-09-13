import lodash from 'lodash';
import { transformIncrementDecrementOperators } from '../node_types/updateExpression.mjs';
import { NaNVariable } from './NaNVariable.mjs';
import { UndefinedVariable } from './undefinedVariable.mjs';

export const VariableType = Object.freeze({
    'unknown': 'unknown',
    'array': 'array', 
    'literal': 'literal',
    'object': 'object',
    'undefined':'undefined',
    'NaN':'NaN',
});

let variablesMap = new Map();
let variablesToPostfix = new Map();

export function getFromVariables(name, operator) {
    doPostfix();
    if (name === 'NaN') {
        return new NaNVariable();
    }
    if (name === "undefined") {
        return new UndefinedVariable();
    }
    let variable = variablesMap.get(name);
    if (operator !== undefined && variable.value !== undefined) {
        variablesToPostfix.set(name, operator);
    } 
    return variable;
}

export function setToVariables(name, variable) {
    doPostfix();
    variablesMap.set(name, variable);
}

export function getVariables() {
    doPostfix();
    return variablesMap;
}

export function clearVariablesMap() {
    doPostfix();
    variablesMap.clear();
    variablesToPostfix.clear();
}

function doPostfix() {
    for (const [key, value] of variablesToPostfix.entries()) {
        let variable = variablesMap.get(key);
        variable.value = eval(String(variable.value) + transformIncrementDecrementOperators(value));
    }
    variablesToPostfix.clear();
}

export function getCopyOrReference(variable) {
    switch (variable.type) {
        case VariableType.literal:
        case VariableType.undefined:
        case VariableType.unknown:
        case VariableType.NaN:
            return lodash.cloneDeep(variable);
        case VariableType.array:
        case VariableType.object:
            return variable;
    }
}