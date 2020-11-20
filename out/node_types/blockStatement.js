"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleBlockStatement = handleBlockStatement;

var _variable = require("../types/variable.js");

var _nodeType = require("./nodeType.js");

function handleBlockStatement(blockNode) {
  // New scope
  (0, _variable.increaseScope)();
  (0, _nodeType.processASTNode)(blockNode.body); // End scope.

  (0, _variable.decreaseScope)();
}