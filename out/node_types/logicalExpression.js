"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveLogicalExpressionChain = solveLogicalExpressionChain;

var _nodes = require("../ast_utilities/nodes.js");

var _stringEval = require("../common/stringEval.js");

var _nodeType = require("./nodeType.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _variable = require("../types/variable.js");

var _fix = require("../fixes/fix.js");

var _unnecessaryBinaryOperation = require("../fixes/unnecessaryBinaryOperation.js");

var _astTraversal = require("../ast_utilities/astTraversal.js");

var _app = require("../app.js");

function solveLogicalExpressionChain(baseNode) {
  let leftValue;
  let rightValue;

  if (baseNode.left.type === _nodeType.NodeType.LogicalExpression) {
    leftValue = solveLogicalExpressionChain(baseNode.left);
  } else {
    leftValue = (0, _nodeType.getVariable)(baseNode.left);
  }

  if (baseNode.right.type === _nodeType.NodeType.LogicalExpression) {
    rightValue = solveLogicalExpressionChain(baseNode.right);
  } else {
    rightValue = (0, _nodeType.getVariable)(baseNode.right);
  }

  let result = (0, _stringEval.logicalBinaryOperation)(leftValue, baseNode.operator, rightValue); // ONLY IF NOT IN LOOP

  let parentNode = getOuterLoop(baseNode);

  if (parentNode === undefined || parentNode.type === _nodeType.NodeType.ForStatement || parentNode.type === _nodeType.NodeType.WhileStatement || parentNode.type === _nodeType.NodeType.DoWhileStatement) {
    return result;
  }

  switch (baseNode.operator) {
    case '&&':
      if (leftValue.type === _variable.VariableType.NaN || leftValue.type === _variable.VariableType.undefined || leftValue.type === _variable.VariableType.literal && Boolean(leftValue.value)) {
        (0, _fix.addToFixSet)(new _unnecessaryBinaryOperation.UnnecessaryBinaryOperation(true, false, baseNode, result));
      }

      break;

    case '||':
      if (leftValue.type === _variable.VariableType.NaN || leftValue.type === _variable.VariableType.undefined || leftValue.type === _variable.VariableType.literal && Boolean(leftValue.value)) {
        (0, _fix.addToFixSet)(new _unnecessaryBinaryOperation.UnnecessaryBinaryOperation(false, true, baseNode, result));
      }

      break;
  }

  return result;
}

function getOuterLoop(node) {
  if (node && node.type !== _nodeType.NodeType.ForStatement && node.type !== _nodeType.NodeType.WhileStatement && node.type !== _nodeType.NodeType.DoWhileStatement && node.type !== _nodeType.NodeType.Program) {
    return getOuterLoop((0, _astTraversal.getParent)((0, _app.getBaseAST)(), node));
  } else {
    return node;
  }
}