"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleFunctionDeclaration = handleFunctionDeclaration;

var _estreeWalker = _interopRequireDefault(require("estree-walker"));

var _nodes = require("../ast_utilities/nodes.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _variable = require("../types/variable.js");

var _nodeType = require("./nodeType.js");

var _variableDeclarator = require("./variableDeclarator.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var walk = _estreeWalker.walk;

function handleFunctionDeclaration(functionNode) {
  (0, _variable.increaseUnknownLoopNumber)();
  (0, _variable.increaseScope)();
  walk(functionNode.params, {
    enter: function enter(node, parent, prop, index) {
      if (node.type === _nodeType.NodeType.Identifier) {
        (0, _variableDeclarator.handleVariableDeclarator)((0, _nodes.createUnknownVariableDeclaratorNode)(node.name));
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });

  if (functionNode.body.body) {
    (0, _nodeType.processASTNode)(functionNode.body.body);
  } else {
    (0, _nodeType.processASTNode)(functionNode.body);
  }

  (0, _variable.decreaseScope)();
  (0, _variable.decreaseUnknownLoopNumber)();
  return new _unknownVariable.UnknownVariable();
}