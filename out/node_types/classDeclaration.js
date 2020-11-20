"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleClassDeclaration = handleClassDeclaration;

var _variable = require("../types/variable.js");

var _nodeType = require("./nodeType.js");

var _objectVariable = require("../types/objectVariable.js");

function handleClassDeclaration(classNode) {
  (0, _variable.increaseScope)();

  if (classNode.superClass !== null) {
    (0, _variable.createVariable)("super", new _objectVariable.ObjectVariable([]));
    (0, _variable.createVariable)("this", new _objectVariable.ObjectVariable([{}], true));
  } else {
    (0, _variable.createVariable)("this", new _objectVariable.ObjectVariable([], true));
  }

  (0, _nodeType.processASTNode)(classNode.body);
  (0, _variable.decreaseScope)();
}