import lodash from 'lodash';
import { transformIncrementDecrementOperators } from '../node_types/updateExpression.mjs';
import { NaNVariable } from './NaNVariable.mjs';
import { UnknownVariable } from './unknownVariable.mjs';
import { UndefinedVariable } from './undefinedVariable.mjs';
import { postUnaryOperation } from '../common/stringEval.mjs';
import { NotDefinedVariable } from './notDefinedVariable.mjs';
import { getVariable } from '../node_types/nodeType.mjs';

export const VariableType = Object.freeze({
    'unknown': 'unknown',
    'array': 'array', 
    'literal': 'literal',
    'object': 'object',
    'undefined':'undefined',
    'NaN':'NaN',
    'notDefined':'notDefined',
});

let variablesMapArray = [new Map()];
let unknownLoopNumber = [];

export function increaseUnknownLoopNumber() {
    unknownLoopNumber[unknownLoopNumber.length] = variablesMapArray.length;
}

export function decreaseUnknownLoopNumber() {
    unknownLoopNumber.splice(unknownLoopNumber.length - 1, 1);
}

export function increaseScope() {
    variablesMapArray[variablesMapArray.length] = new Map();
}

export function decreaseScope() {
    variablesMapArray.splice(variablesMapArray.length - 1, 1);
}

export function getFromVariables(name) {

    let variable = getVar(name);
    if (variable === undefined) {
        if ((typeof name) === "undefined" || name === "undefined") {
            return new UndefinedVariable();
        }
        if (name === "NaN") {
            return new NaNVariable();
        }
        return new NotDefinedVariable();
    }

    /*
    if (findScopeOf(name) < variablesMapArray.length - 1) {
        return new UnknownVariable();
    }
    */
    return variable;
}

function getVar(name) {
    for (let i = variablesMapArray.length - 1; i >= 0; i--) {
        if (variablesMapArray[i].has(name)) {
            return variablesMapArray[i].get(name);
        }
    }

    return;
}

export function createVariable(name, variable) {
    variablesMapArray[variablesMapArray.length - 1].set(name, variable);
}

export function createVariableAt(name, variable) {
    variablesMapArray[findScopeOf(name)].set(name, variable);
}

export function assignVariable(name, variable) {
    let index = findScopeOf(name);

    if (index >= 0) {
        if (inUnknownLoop(name)) {
            variablesMapArray[index].set(name, new UnknownVariable());
        } else {
            variablesMapArray[index].set(name, variable);
        }
    } else {
        // Weird javascript stuff, apparently it's sometimes possible to set something to a new value
        // e.g. "Dagoba = {}" without having declared Dagoba first or imported it or whatever...
        createVariable(name, variable);
        //console.error("wanted to assign '" + name + "' to new value but could not find in variables maps");
        //throw Error();
    }
}

export function inUnknownLoop(name) {
    return unknownLoopNumber[unknownLoopNumber.length - 1] > findScopeOf(name);
}

function findScopeOf(name) {
    for (let i = variablesMapArray.length - 1; i >= 0; i--) {
        if (variablesMapArray[i].has(name)) {
            return i;
        }
    }
    return -1;
}

export function getVariables() {
    return variablesMapArray;
}

export function clearVariablesMap() {
    variablesMapArray = [new Map()];
    unknownLoopNumber = [];
}

export function getCopyOrReference(variable) {
    switch (variable.type) {
        case VariableType.literal:
        case VariableType.undefined:
        case VariableType.unknown:
        case VariableType.NaN:
        case VariableType.notDefined:
            return lodash.cloneDeep(variable);
        case VariableType.array:
        case VariableType.object:
            return variable;
    }
}