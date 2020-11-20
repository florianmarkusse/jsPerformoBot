"use strict";

require("core-js/modules/es.string.replace");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postUnaryOperation = postUnaryOperation;
exports.preUnaryOperation = preUnaryOperation;
exports.binaryOperation = binaryOperation;
exports.logicalBinaryOperation = logicalBinaryOperation;

var _unknownVariable = require("../types/unknownVariable.js");

var _variable = require("../types/variable.js");

function postUnaryOperation(value, operator) {
  let string = typeof value !== 'string' ? String(value) : '"' + value + '"';
  let evalString = fixEscapeCharacters(string) + operator;
  return eval(evalString);
}

function preUnaryOperation(operator, value) {
  let string = typeof value !== 'string' ? String(value) : '"' + value + '"';
  let evalString = operator + fixEscapeCharacters(string);

  try {
    return eval(evalString);
  } catch (err) {
    return "joghdfgdfbgkldfndfgfdgjdfpg";
  }
}

function binaryOperation(leftValue, operator, rightValue) {
  let leftString = typeof leftValue !== 'string' ? String(leftValue) : '"' + leftValue + '"';
  let rightString = typeof rightValue !== 'string' ? String(rightValue) : '"' + rightValue + '"';
  let evalString = fixEscapeCharacters(leftString) + operator + fixEscapeCharacters(rightString);

  try {
    return eval(evalString);
  } catch (err) {
    return "joghdfgdfbgkldfndfgfdgjdfpg";
  }
}

function logicalBinaryOperation(leftValue, operator, rightValue) {
  if (leftValue.type === _variable.VariableType.unknown || leftValue.type === _variable.VariableType.notDefined) {
    return new _unknownVariable.UnknownVariable();
  }

  switch (operator) {
    case "&&":
      if (leftValue.type === _variable.VariableType.NaN || leftValue.type === _variable.VariableType.undefined || leftValue.type === _variable.VariableType.literal && !Boolean(leftValue.value)) {
        return leftValue;
      } else {
        return rightValue;
      }

    case "||":
      if (leftValue.type === _variable.VariableType.NaN || leftValue.type === _variable.VariableType.undefined || leftValue.type === _variable.VariableType.literal && !Boolean(leftValue.value)) {
        return rightValue;
      } else {
        return leftValue;
      }

      return;

    case "??":
      if (leftValue.type === _variable.VariableType.literal && leftValue.value === null || leftValue.type === _variable.VariableType.undefined) {
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