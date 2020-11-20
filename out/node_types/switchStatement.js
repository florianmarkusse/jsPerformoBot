"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleSwitchStatement = handleSwitchStatement;

var _variable = require("../types/variable.js");

var _nodeType = require("./nodeType.js");

function handleSwitchStatement(switchNode) {
  (0, _variable.increaseScope)();
  (0, _variable.increaseUnknownLoopNumber)();
  switchNode.cases.forEach(switchCase => {
    (0, _nodeType.processASTNode)(switchCase);
  });
  (0, _variable.decreaseUnknownLoopNumber)();
  (0, _variable.decreaseScope)();
}