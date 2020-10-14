import { UnknownVariable } from "../types/unknownVariable.mjs";
import { VariableType } from "../types/variable.mjs";

export function postUnaryOperation(value, operator) {
    let string = typeof value !== 'string' ? String(value) : '"' + value + '"';
    let evalString = fixEscapeCharacters(string) + operator;
    return eval(evalString);
}

export function preUnaryOperation(operator, value) {
    let string = typeof value !== 'string' ? String(value) : '"' + value + '"';
    let evalString = operator + fixEscapeCharacters(string);
    try {
        return eval(evalString)
    } catch (err) {
        return "joghdfgdfbgkldfndfgfdgjdfpg";
    }
}

export function binaryOperation(leftValue, operator, rightValue) {
    let leftString = typeof leftValue !== 'string' ? String(leftValue) : '"' + leftValue + '"';
    let rightString = typeof rightValue !== 'string' ? String(rightValue) : '"' + rightValue + '"';

    let evalString = fixEscapeCharacters(leftString) + operator + fixEscapeCharacters(rightString);

    try {
        return eval(evalString)
    } catch (err) {
        return "joghdfgdfbgkldfndfgfdgjdfpg";
    }
}

export function logicalBinaryOperation(leftValue, operator, rightValue) {
    if (leftValue.type === VariableType.unknown || leftValue.type === VariableType.notDefined) {
        return new UnknownVariable();
    }
    switch (operator) {
        case "&&":
            if (leftValue.type === VariableType.NaN || leftValue.type === VariableType.undefined ||
                leftValue.type === VariableType.literal && !(Boolean(leftValue.value))) {
                    return leftValue;
                } else {
                    return rightValue;
                }
        case "||":
            if (leftValue.type === VariableType.NaN || leftValue.type === VariableType.undefined ||
                leftValue.type === VariableType.literal && !(Boolean(leftValue.value))) {
                    return rightValue;
                } else {
                    return leftValue;
                }
            return ;
        case "??":
            if ((leftValue.type === VariableType.literal && leftValue.value === null) ||
                leftValue.type === VariableType.undefined) {
                    return rightValue;
            } else {
                return leftValue;
            }
    }
}

function fixEscapeCharacters(string) {
    let newString = string.replace('\n', '\\n');
    newString = newString.replace('\r', '\\r');
    newString = newString.replace('\t', '\\t');
    newString = newString.replace('\b', '\\b');
    newString = newString.replace('\f', '\\f');
    newString = newString.replace('\v', '\\v');
    newString = newString.replace('\0', '\\0');
    return newString;
}