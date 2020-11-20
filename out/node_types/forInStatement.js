"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleForInStatement = handleForInStatement;

var _lodash = _interopRequireDefault(require("lodash"));

var _estreeWalker = _interopRequireDefault(require("estree-walker"));

var _nodes = require("../ast_utilities/nodes.js");

var _nodeType = require("./nodeType.js");

var _variableDeclarator = require("./variableDeclarator.js");

var _loop = require("../common/loop.js");

var _variable = require("../types/variable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var walk = _estreeWalker.walk;

function handleForInStatement(forInNode) {
  (0, _variable.increaseScope)();
  walk(forInNode.left, {
    enter: function enter(node, parent, prop, index) {
      if (node.type === _nodeType.NodeType.Identifier) {
        (0, _variableDeclarator.handleVariableDeclarator)((0, _nodes.createUnknownVariableDeclaratorNode)(node.name));
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  let arr;

  if (forInNode.body.body && forInNode.body.type === _nodeType.NodeType.BlockStatement) {
    arr = _lodash.default.cloneDeep(forInNode.body.body);
  } else {
    arr = [_lodash.default.cloneDeep(forInNode.body)];
  }

  (0, _loop.performLoop)(null, arr);
  (0, _variable.decreaseScope)();
}