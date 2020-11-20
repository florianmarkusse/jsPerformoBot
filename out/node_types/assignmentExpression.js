"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleAssignmentExpression = handleAssignmentExpression;

var _nodeType = require("./nodeType.js");

var _memberExpression = require("./memberExpression.js");

var _variable = require("../types/variable.js");

var _stringEval = require("../common/stringEval.js");

var _literalVariable = require("../types/literalVariable.js");

var _arrayPattern = require("./arrayPattern.js");

var _objectPattern = require("./objectPattern.js");

var _unknownVariable = require("../types/unknownVariable.js");

function handleAssignmentExpression(assignmentNode) {
  let right;

  if (assignmentNode.right.type === _nodeType.NodeType.AssignmentExpression) {
    right = handleAssignmentExpression(assignmentNode.right);
  } else {
    right = (0, _nodeType.getVariable)(assignmentNode.right);
  }

  if (right === undefined) {
    console.error(assignmentNode);
    throw Error();
  }

  switch (assignmentNode.left.type) {
    case _nodeType.NodeType.ArrayPattern:
      (0, _arrayPattern.handleArrayPattern)(assignmentNode.left, false);
      return new _unknownVariable.UnknownVariable();

    case _nodeType.NodeType.ObjectPattern:
      (0, _objectPattern.handleObjectPattern)(assignmentNode.left, false);
      return new _unknownVariable.UnknownVariable();

    case _nodeType.NodeType.Identifier:
      let left = (0, _variable.getFromVariables)(assignmentNode.left.name);

      if (left.type === right.type && left.type === _variable.VariableType.literal && assignmentNode.operator !== "=") {
        right = new _literalVariable.LiteralVariable((0, _stringEval.binaryOperation)(left.value, assignmentNode.operator.slice(0, -1), right.value));
      }

      (0, _variable.assignVariable)(assignmentNode.left.name, right);
      return (0, _variable.getCopyOrReference)(right);

    case _nodeType.NodeType.MemberExpression:
      let result = (0, _memberExpression.solveMemberExpression)(assignmentNode.left);

      if (result[0].type === _variable.VariableType.unknown || result[0].type === _variable.VariableType.notDefined || result[0].type === _variable.VariableType.undefined) {
        return (0, _variable.getCopyOrReference)(right);
      }

      if (typeof result[0].get !== "function") {
        (0, _variable.assignVariable)(assignmentNode.left.object.name, new _unknownVariable.UnknownVariable());
        return new _unknownVariable.UnknownVariable();
      }

      let variable = result[0].get(result[1]);

      if (variable && variable.type === right.type && variable.type === _variable.VariableType.literal && assignmentNode.operator !== "=") {
        right = new _literalVariable.LiteralVariable((0, _stringEval.binaryOperation)(variable.value, assignmentNode.operator.slice(0, -1), right.value));
      }

      result[0].set(result[1], right, getNameOrConstant(assignmentNode.left.property), (0, _memberExpression.digUntilBase)(assignmentNode.left));
      return (0, _variable.getCopyOrReference)(right);
  }
}

function getNameOrConstant(node) {
  if (node.name === undefined) {
    return node.value;
  } else {
    return node.name;
  }
}