"use strict";

require("core-js/modules/es.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveBinaryExpressionChain = solveBinaryExpressionChain;

var _lodash = _interopRequireDefault(require("lodash"));

var _nodeType = require("./nodeType.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _variable = require("../types/variable.js");

var _NaNVariable = require("../types/NaNVariable.js");

var _literalVariable = require("../types/literalVariable.js");

var _undefinedVariable = require("../types/undefinedVariable.js");

var _fix = require("../fixes/fix.js");

var _UnnecessaryBinaryOperation = require("../fixes/unnecessaryBinaryOperation.js");

var _stringEval = require("../common/stringEval.js");

var _notDefinedVariable = require("../types/notDefinedVariable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function solveBinaryExpressionChain(baseNode) {
  let leftValue;
  let rightValue;

  if (baseNode.left.type === _nodeType.NodeType.BinaryExpression) {
    leftValue = solveBinaryExpressionChain(baseNode.left);
    rightValue = _lodash.default.cloneDeep((0, _nodeType.getVariable)(baseNode.right));
  } else if (baseNode.right.type === _nodeType.NodeType.BinaryExpression) {
    rightValue = solveBinaryExpressionChain(baseNode.right);
    leftValue = _lodash.default.cloneDeep((0, _nodeType.getVariable)(baseNode.left));
  } else {
    leftValue = _lodash.default.cloneDeep((0, _nodeType.getVariable)(baseNode.left));
    rightValue = _lodash.default.cloneDeep((0, _nodeType.getVariable)(baseNode.right));
  }

  let stringify = false;
  let toNaN = false;
  let toUnknown = false;
  let toNotDefined = false;
  let leftUndefined = false;
  let rightUndefined = false;

  switch (leftValue.type) {
    case _variable.VariableType.notDefined:
      toNotDefined = true;
      break;

    case _variable.VariableType.undefined:
      leftUndefined = true;
      break;

    case _variable.VariableType.unknown:
      toUnknown = true;
      break;

    case _variable.VariableType.NaN:
      toNaN = true;
      break;

    case _variable.VariableType.array:
    case _variable.VariableType.object:
      if (baseNode.operator === "+") {
        stringify = true;
      } else if (baseNode.operator === '|' || baseNode.operator === '&') {
        leftValue = new _literalVariable.LiteralVariable(0);
      } else {
        toNaN = true;
      }

      break;
  }

  switch (rightValue.type) {
    case _variable.VariableType.notDefined:
      toNotDefined = true;
      break;

    case _variable.VariableType.undefined:
      rightUndefined = true;
      break;

    case _variable.VariableType.unknown:
      toUnknown = true;
      break;

    case _variable.VariableType.NaN:
      toNaN = true;
      break;

    case _variable.VariableType.array:
    case _variable.VariableType.object:
      if (baseNode.operator === "+") {
        stringify = true;
      } else if (baseNode.operator === '|' || baseNode.operator === '&') {
        rightValue = new _literalVariable.LiteralVariable(0);
      } else {
        toNaN = true;
      }

      break;
  }

  let result;

  if (toNotDefined) {
    result = new _notDefinedVariable.NotDefinedVariable();
  } else if (toUnknown) {
    result = new _unknownVariable.UnknownVariable();
  } else if (stringify) {
    result = new _literalVariable.LiteralVariable(String(leftValue.value) + String(rightValue.value));
  } else if (toNaN) {
    result = new _NaNVariable.NaNVariable();
  } else {
    let evalResult = (0, _stringEval.binaryOperation)(leftValue.value, baseNode.operator, rightValue.value);

    if (evalResult === "joghdfgdfbgkldfndfgfdgjdfpg") {
      result = new _unknownVariable.UnknownVariable();
    } else if (isNaN(evalResult)) {
      result = new _NaNVariable.NaNVariable();
    } else if (evalResult === undefined) {
      result = new _undefinedVariable.UndefinedVariable();
    } else {
      result = new _literalVariable.LiteralVariable(evalResult);
    }
  }

  if ((leftUndefined || rightUndefined) && !baseNode.operator.includes("=")) {
    (0, _fix.addToFixSet)(new _UnnecessaryBinaryOperation.UnnecessaryBinaryOperation(leftUndefined, rightUndefined, baseNode, result));
  }

  return result;
}