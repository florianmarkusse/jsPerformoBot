"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUnaryExpression = handleUnaryExpression;

var _nodeType = require("./nodeType.js");

var _NaNVariable = require("../types/NaNVariable.js");

var _literalVariable = require("../types/literalVariable.js");

var _variable = require("../types/variable.js");

var _stringEval = require("../common/stringEval.js");

var _notDefinedVariable = require("../types/notDefinedVariable.js");

var _unknownVariable = require("../types/unknownVariable.js");

function handleUnaryExpression(unaryNode) {
  if (unaryNode.operator === "delete" || unaryNode.operator === "void" || unaryNode.operator === "typeof") {
    (0, _nodeType.getVariable)(unaryNode.argument);
    return new _unknownVariable.UnknownVariable();
  }

  let variable = (0, _nodeType.getVariable)(unaryNode.argument);

  if (variable.type === _variable.VariableType.unknown) {
    return new _unknownVariable.UnknownVariable();
  }

  if (variable.type === _variable.VariableType.notDefined) {
    return new _notDefinedVariable.NotDefinedVariable();
  }

  let nanCheck;

  try {
    nanCheck = !isNaN(variable.value);
  } catch (err) {
    return new _unknownVariable.UnknownVariable();
  }

  if (variable.type === _variable.VariableType.literal && nanCheck) {
    let result = (0, _stringEval.preUnaryOperation)(unaryNode.operator, variable.value);

    if (result === "joghdfgdfbgkldfndfgfdgjdfpg") {
      return new _unknownVariable.UnknownVariable();
    }

    return new _literalVariable.LiteralVariable(result);
  } else {
    return new _NaNVariable.NaNVariable();
  }
}