"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveConditionalExpression = solveConditionalExpression;

var _unknownVariable = require("../types/unknownVariable.js");

var _nodeType = require("./nodeType.js");

function solveConditionalExpression(conditionNode) {
  (0, _nodeType.processASTNode)(conditionNode.test);
  return new _unknownVariable.UnknownVariable();
}