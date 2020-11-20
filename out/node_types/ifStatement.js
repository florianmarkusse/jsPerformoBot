"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleIfStatement = handleIfStatement;

var _nodeType = require("./nodeType.js");

var _variable = require("../types/variable.js");

function handleIfStatement(ifNode) {
  (0, _nodeType.processASTNode)(ifNode.test);
  (0, _variable.increaseUnknownLoopNumber)();
  (0, _variable.increaseScope)();

  if (ifNode.consequent) {
    if (ifNode.consequent.body && ifNode.consequent.type === _nodeType.NodeType.BlockStatement) {
      (0, _nodeType.processASTNode)(ifNode.consequent.body);
    } else {
      (0, _nodeType.processASTNode)(ifNode.consequent);
    }
  }

  (0, _variable.decreaseScope)();
  (0, _variable.decreaseUnknownLoopNumber)();
  (0, _variable.increaseUnknownLoopNumber)();
  (0, _variable.increaseScope)();

  if (ifNode.alternate) {
    if (ifNode.alternate.body && ifNode.alternate.type === _nodeType.NodeType.BlockStatement) {
      (0, _nodeType.processASTNode)(ifNode.alternate.body);
    } else {
      (0, _nodeType.processASTNode)(ifNode.alternate);
    }
  }

  (0, _variable.decreaseScope)();
  (0, _variable.decreaseUnknownLoopNumber)();
}