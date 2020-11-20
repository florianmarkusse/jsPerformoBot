"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performLoop = performLoop;

var _nodeType = require("../node_types/nodeType.js");

var _variable = require("../types/variable.js");

function performLoop(testNode, bodyNodes) {
  (0, _nodeType.processASTNode)(testNode);
  let result = (0, _nodeType.getVariable)(testNode);

  while (result.type === 'literal' && result.value) {
    (0, _nodeType.processASTNode)(bodyNodes);
    (0, _nodeType.processASTNode)(testNode);
    result = (0, _nodeType.getVariable)(testNode);
  }

  if (result.type === 'unknown') {
    (0, _variable.increaseUnknownLoopNumber)();
    (0, _nodeType.processASTNode)(bodyNodes);
    (0, _variable.decreaseUnknownLoopNumber)();
  }
}