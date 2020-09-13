import lodash from 'lodash';

import { NodeType } from './nodeType.mjs'; 
import { getVariable } from './nodeType.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';
import { VariableType } from '../types/variable.mjs';
import { NaNVariable } from '../types/NaNVariable.mjs';
import { LiteralVariable } from '../types/literalVariable.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';
import { addToFixSet } from '../fixes/fix.mjs';
import { BinaryUndefined } from '../fixes/binaryUndefined.mjs';

export function solveBinaryExpressionChain(baseNode) {

    let leftValue;
    let rightValue;

    if (baseNode.left.type === NodeType.BinaryExpression) {
        leftValue = solveBinaryExpressionChain(baseNode.left);
        rightValue = lodash.cloneDeep(getVariable(baseNode.right));
    } else if (baseNode.right.type === NodeType.BinaryExpression) {
        rightValue = solveBinaryExpressionChain(baseNode.right);
        leftValue = lodash.cloneDeep(getVariable(baseNode.left));
    } else {
        leftValue = lodash.cloneDeep(getVariable(baseNode.left));
        rightValue = lodash.cloneDeep(getVariable(baseNode.right));
    }

    let stringify = false;
    let toNaN = false;
    let toUnknown = false;

    let leftUndefined = false;
    let rightUndefined = false;

    switch (leftValue.type) {
        case VariableType.undefined:
            leftUndefined = true;
            break;
        case VariableType.unknown:
            toUnknown = true;
            break;
        case VariableType.NaN:
            toNaN = true;
            break;
        case VariableType.array:
        case VariableType.object:
            if (baseNode.operator === "+") {
                stringify = true;
            } else if (baseNode.operator === '|' || baseNode.operator === '&') {
                leftValue = new LiteralVariable(0);
            } else {
                toNaN = true;
            }
        break;
    }

    switch (rightValue.type) {
        case VariableType.undefined:
            rightUndefined = true;
            break;
        case VariableType.unknown:
            toUnknown = true;
            break;
        case VariableType.NaN:
            toNaN = true;
            break;
        case VariableType.array:
        case VariableType.object:
            if (baseNode.operator === "+") {
                stringify = true;
            } else if (baseNode.operator === '|' || baseNode.operator === '&') {
                rightValue = new LiteralVariable(0);
            } else {
                toNaN = true;
            }
        break;
    }

    let result;

    if (toUnknown) {
        result = new UnknownVariable();
    }
    else if (stringify) {
        result = new LiteralVariable(String(leftValue.value) + String(rightValue.value));
    } 
    else if (toNaN) {
        result = new NaNVariable();
    } 
    else {
        let evalResult = eval(String(leftValue.value) + baseNode.operator + String(rightValue.value));

        if (isNaN(evalResult)) {
            result = new NaNVariable();
        } else if (evalResult === undefined) {
            result = new UndefinedVariable();
        } else {
            result = new LiteralVariable(evalResult);
        }
    }

    if (leftUndefined || rightUndefined) {
        addToFixSet(new BinaryUndefined(leftUndefined, rightUndefined, baseNode, result));
    }

    return result;
}


